// src/pages/RecycleTable.tsx

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Ticket } from '../types/type';
import { useState } from 'react';
import { Eye, RotateCw, Trash2 } from 'lucide-react';
import useHardDeleteTicket from '../hooks/use-hard-delete-ticket';
import useHardDeleteTickets from '../hooks/use-hard-delete-tickets';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import { ReusableTable } from '../../../shared/components/table';
import Modal from '../../../shared/components/modal';
import Button from '../../../shared/components/button';
import { fetchRecycledTickets } from '../services/get';
import useRestoreTicket from '../hooks/use-restore-ticket';
import useRestoreTickets from '../hooks/use-restore-tickets';
import useSendNotification from '../../notifications/hooks/use-send-notification';
import { useSocket } from '../../../hooks/use-socket';
import type { Column } from '../../../shared/types/table';

interface ModalData {
  head: string;
  description: string;
  type: 'single' | 'multiple';
  action: string;
  value: any; // or more specific type
  ids?: string | string[]; // depending on single/multiple
  id?: string | string[];
}

export default function RecycleTable() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const columns: Column<Ticket>[] = [
    {
      id: 'name',
      header: t('tickets.text.name'),
      accessor: (row) => row.name,
      accessorRaw: (row) => row.name,
      sortable: true,
      filter: { kind: 'text' },
      fixedVisible: true,
    },

    {
      id: 'user.name',
      header: t('users.text.employee'),
      accessor: (row) => row.user?.name,
      accessorRaw: (row) => row.user?.name,
      sortable: true,
      filter: { kind: 'text' },
      hiddenOnMobile: true,
    },
    {
      id: 'deletedAt',
      header: t('tickets.text.remaining'),
      accessor: (row) => {
        if (!row.deletedAt) return 'Active'; // or 30 if you prefer
        const deletedAt = new Date(row.deletedAt);
        const now = new Date();
        const diffMs = now.getTime() - deletedAt.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const remaining = Math.max(30 - diffDays, 0);
        return remaining; // remaining days
      },
      accessorRaw: (row) => row.deletedAt,
      sortable: true,
      filter: { kind: 'text' },
    },
  ];

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({});

  const rowActions = [
    {
      label: t('general.text.view'),
      icon: <Eye />,
      onClick: (row: Ticket) => navigate(`/recycle-bin/${row.documentId}`),
    },
    {
      label: t('general.text.restore'),
      icon: <RotateCw />,
      color: 'red',
      onClick: (row: Ticket) => {
        setModalData({
          head: t('tickets.text.restoreHead'),
          description: t('tickets.text.restoreDescription', {
            name: row.name,
          }),
          type: 'single',
          action: 'restore',
          value: row,
          ids: row.documentId,
        });
        setIsOpenModal(true);
      },
      disabled: (row: Ticket, selectedKeys: Set<string | number>) =>
        selectedKeys.size > 1,
    },
    {
      label: t('general.text.delete'),
      icon: <Trash2 />,
      color: 'red',
      onClick: (row: Ticket) => {
        setModalData({
          head: t('tickets.text.deleteHardHead'),
          description: t('tickets.text.deleteHardDescription', {
            name: row.name,
          }),
          type: 'single',
          action: 'delete',
          value: row,
          ids: row.documentId,
        });
        setIsOpenModal(true);
      },
      disabled: (row: Ticket, selectedKeys: Set<string | number>) =>
        selectedKeys.size > 1,
    },
  ];

  const bulkActions = [
    {
      label: t('general.text.restoreAll'),
      icon: <RotateCw />,
      onClick: (rows: Ticket[]) => {
        setModalData({
          head: t('tickets.text.restoreMultipleHead'),
          description: t('tickets.text.restoreMultipleDescription', {
            count: rows.length,
          }),
          type: 'multiple',
          action: 'restore',
          value: rows,
          ids: rows.map((row) => row?.documentId),
        });
        setIsOpenModal(true);
      },
    },

    {
      label: t('general.text.deleteAll'),
      icon: <Trash2 />,
      onClick: (rows: Ticket[]) => {
        setModalData({
          head: t('tickets.text.deleteMultipleHead'),
          description: t('tickets.text.deleteMultipleDescription', {
            count: rows.length,
          }),
          type: 'multiple',
          action: 'delete',
          value: rows,
          ids: rows.map((row) => row?.documentId),
        });
        setIsOpenModal(true);
      },
    },
  ];

  const {
    mutate: hardDeleteTicketMutate,
    isPending: isPendingHardDeleteTicket,
    isError: isErrorHardDeleteTicket,
  } = useHardDeleteTicket();
  const {
    mutate: hardDeleteTicketsMutate,
    isPending: isPendingHardDeleteTickets,
    isError: isErrorHardDeleteTickets,
  } = useHardDeleteTickets();

  const {
    mutate: restoreTicketMutate,
    isPending: isPendingRestoreTicket,
    isError: isErrorRestoreTicket,
  } = useRestoreTicket();

  const {
    mutate: restoreTicketsMutate,
    isPending: isPendingRestoreTickets,
    isError: isErrorRestoreTickets,
  } = useRestoreTickets();

  const { mutate: sendNotification } = useSendNotification();
  const { socket } = useSocket();

  const handleSubmit = () => {
    if (modalData?.type === 'single' && modalData.action === 'delete') {
      hardDeleteTicketMutate(modalData?.ids, {
        onSuccess: (returnedData) => {
          toast.success(t('tickets.success.hardDeletedOne'));
          queryClient.invalidateQueries({ queryKey: ['recycle'] });
          setIsOpenModal(false);
          if (modalData?.value.user.id) {
            sendNotification({
              userId: modalData?.value.user.id,
              title: t('notifications.text.hardDeleteHead'),
              message: t('notifications.text.hardDeleteDescription', {
                name: modalData?.value?.name,
              }),
            });
            if (socket) {
              socket.emit('sendNotification', {
                recipientId: modalData?.value?.user?.id,
                data: {
                  title: t('notifications.text.hardDeleteHead'),
                  message: t('notifications.text.hardDeleteDescription', {
                    name: modalData?.value?.name,
                  }),
                },
              });
            }
          }
        },
        onError: (err) => toast.error(t('tickets.errors.hardDeletedOne')),
      });
    } else if (
      modalData?.type === 'multiple' &&
      modalData.action === 'delete'
    ) {
      hardDeleteTicketsMutate(modalData?.ids, {
        onSuccess: (returnedData) => {
          toast.success(t('tickets.success.hardDeleted'));
          queryClient.invalidateQueries({ queryKey: ['recycle'] });
          setIsOpenModal(false);
        },
        onError: (err) => toast.error(t('tickets.errors.hardDeleted')),
      });
    } else if (modalData?.type === 'single' && modalData.action === 'restore') {
      restoreTicketMutate(modalData?.ids, {
        onSuccess: (returnedData) => {
          toast.success(t('tickets.success.restoreOne'));
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          queryClient.invalidateQueries({ queryKey: ['recycle'] });
          setIsOpenModal(false);
          if (modalData?.value.user.id) {
            sendNotification({
              userId: modalData?.value.user.id,
              title: t('notifications.text.restoreHead'),
              message: t('notifications.text.restoreDescription', {
                name: modalData?.value?.name,
              }),
            });
            if (socket) {
              socket.emit('sendNotification', {
                recipientId: modalData?.value?.user?.id,
                data: {
                  title: t('notifications.text.restoreHead'),
                  message: t('notifications.text.restoreDescription', {
                    name: modalData?.value?.name,
                  }),
                },
              });
            }
          }
        },
        onError: (err) => toast.error(t('tickets.errors.restoreOne')),
      });
    } else if (
      modalData?.type === 'multiple' &&
      modalData.action === 'restore'
    ) {
      restoreTicketsMutate(modalData?.ids, {
        onSuccess: (returnedData) => {
          toast.success(t('tickets.success.restore'));
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          queryClient.invalidateQueries({ queryKey: ['recycle'] });
          setIsOpenModal(false);
        },
        onError: (err) => toast.error(t('tickets.errors.restore')),
      });
    }
  };

  const isPendingCondition =
    isPendingHardDeleteTicket ||
    isPendingHardDeleteTickets ||
    isPendingRestoreTicket ||
    isPendingRestoreTickets;

  return (
    <>
      <ReusableTable<Ticket>
        queryKey="recycle"
        columns={columns}
        serverSide
        fetchData={fetchRecycledTickets}
        idForRow={(row) => row?.documentId}
        is3Dots={false}
        rowActions={rowActions}
        bulkActions={bulkActions}
        errorMessage={t('tickets.errors.loadRecycle')}
      />

      <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <h2 className="text-xl font-bold mb-4">{modalData?.head}</h2>
        <p>{modalData?.description}</p>
        <div className="flex gap-[16px] mt-[24px] flex-col sm:flex-row">
          <Button
            onClick={() => setIsOpenModal(false)}
            className={'w-full'}
            variant="inverse"
            disabled={isPendingCondition}>
            {t('general.text.cancel')}
          </Button>
          <Button
            className={'w-full'}
            onClick={handleSubmit}
            disabled={isPendingCondition}>
            {isPendingCondition
              ? modalData?.action === 'delete'
                ? t('general.pending.deleting')
                : t('general.pending.restoring')
              : modalData?.action === 'delete'
              ? t('general.text.delete')
              : t('general.text.restore')}
          </Button>
        </div>
      </Modal>
    </>
  );
}

