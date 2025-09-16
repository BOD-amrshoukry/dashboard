import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import type { Ticket } from '../../tickets/types/type';
import useTicketStates from '../../tickets/hooks/use-ticket-states';
import { useState } from 'react';
import { CircleX, Eye, Pencil, Trash2 } from 'lucide-react';
import useSoftDeleteTicket from '../../tickets/hooks/use-soft-delete-ticket';
import useSoftDeleteTickets from '../../tickets/hooks/use-soft-delete-tickets';
import useUnassignTicket from '../../tickets/hooks/use-unassign-ticket';
import useUnassignTickets from '../../tickets/hooks/use-unassign-tickets';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import { ReusableTable } from '../../../shared/components/table';
import Modal from '../../../shared/components/modal';
import Button from '../../../shared/components/button';
import { fetchTickets } from '../../tickets/services/get';
import { useSocket } from '../../../hooks/use-socket';
import useSendNotification from '../../notifications/hooks/use-send-notification';
import type { Column } from '../../../shared/types/table';

export default function EmployeeTicketsTable() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { t } = useTranslation();
  const options = useTicketStates();

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
      id: 'state',
      header: t('tickets.text.state'),
      accessor: (row) => row.state,
      accessorRaw: (row) => row.state,
      sortable: true,
      filter: { kind: 'select', options: options },
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
  ];

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const rowActions = [
    {
      label: t('general.text.view'),
      icon: <Eye />,
      onClick: (row: Ticket) => navigate(`/tickets/${row.documentId}`),
    },
    {
      label: t('general.text.edit'),
      icon: <Pencil />,
      onClick: (row: Ticket) => navigate(`/tickets/${row.documentId}/edit`),
    },
    {
      label: t('general.text.delete'),
      icon: <Trash2 />,
      color: 'red',
      onClick: (row: Ticket) => {
        setModalData({
          head: t('tickets.text.deleteHead'),
          description: t('tickets.text.deleteDescription', {
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
    {
      label: t('general.text.unassign'),
      icon: <CircleX />,
      color: 'red',
      onClick: (row: Ticket) => {
        setModalData({
          head: t('tickets.text.unassignHead'),
          description: t('tickets.text.unassignDescription', {
            name: row.name,
            employee: row?.user.name,
          }),
          type: 'single',
          action: 'unassign',
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
    {
      label: t('general.text.unassignAll'),
      icon: <CircleX />,
      onClick: (rows: Ticket[]) => {
        setModalData({
          head: t('tickets.text.unassignMultipleHead'),
          description: t('tickets.text.unassignMultipleDescription', {
            count: rows.length,
            employee: rows[0]?.user.name,
          }),
          type: 'multiple',
          action: 'unassign',
          value: rows,
          ids: rows.map((row) => row?.documentId),
        });
        setIsOpenModal(true);
      },
    },
  ];

  const {
    mutate: softDeleteTicketMutate,
    isPending: isPendingSoftDeleteTicket,
    isError: isErrorSoftDeleteTicket,
  } = useSoftDeleteTicket();
  const {
    mutate: softDeleteTicketsMutate,
    isPending: isPendingSoftDeleteTickets,
    isError: isErrorSoftDeleteTickets,
  } = useSoftDeleteTickets();

  const {
    mutate: unassignTicketMutate,
    isPending: isPendingUnassignTicket,
    isError: isErrorUnassignTicket,
  } = useUnassignTicket();

  const {
    mutate: unassignTicketsMutate,
    isPending: isPendingUnassignTickets,
    isError: isErrorUnassignTickets,
  } = useUnassignTickets();

  const { socket } = useSocket();
  const { mutate: sendNotification } = useSendNotification();

  const handleSubmit = () => {
    if (modalData?.type === 'single' && modalData?.action === 'delete') {
      softDeleteTicketMutate(modalData?.ids, {
        onSuccess: (returnedData) => {
          toast.success(t('tickets.success.softDeletedOne'));
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          queryClient.invalidateQueries({ queryKey: ['recycle'] });
          setIsOpenModal(false);
          if (modalData?.value.user.id) {
            sendNotification({
              userId: modalData?.value.user.id,
              title: t('notifications.text.softDeleteHead'),
              message: t('notifications.text.softDeleteDescription', {
                name: modalData?.value?.name,
              }),
            });
            if (socket) {
              socket.emit('sendNotification', {
                recipientId: modalData?.value?.user?.id,
                data: {
                  title: t('notifications.text.softDeleteHead'),
                  message: t('notifications.text.softDeleteDescription', {
                    name: modalData?.value?.name,
                  }),
                },
              });
            }
          }
        },
        onError: (err) => toast.error(t('tickets.errors.softDeletedOne')),
      });
    } else if (
      modalData?.type === 'multiple' &&
      modalData?.action === 'delete'
    ) {
      softDeleteTicketsMutate(modalData?.ids, {
        onSuccess: (returnedData) => {
          toast.success(t('tickets.success.softDeleted'));
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          queryClient.invalidateQueries({ queryKey: ['recycle'] });
          setIsOpenModal(false);
        },
        onError: (err) => toast.error(t('tickets.errors.softDeleted')),
      });
    } else if (
      modalData?.type === 'single' &&
      modalData?.action === 'unassign'
    ) {
      unassignTicketMutate(modalData?.ids, {
        onSuccess: (returnedData) => {
          toast.success(t('tickets.success.unassignOne'));
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          setIsOpenModal(false);
          if (modalData?.value.user.id) {
            sendNotification({
              userId: modalData?.value.user.id,
              title: t('notifications.text.unassignHead'),
              message: t('notifications.text.unassignDescription', {
                name: modalData?.value?.name,
              }),
            });
            if (socket) {
              socket.emit('sendNotification', {
                recipientId: modalData?.value?.user?.id,
                data: {
                  title: t('notifications.text.unassignHead'),
                  message: t('notifications.text.unassignDescription', {
                    name: modalData?.value?.name,
                  }),
                },
              });
            }
          }
        },
        onError: (err) => toast.error(t('tickets.errors.unassignOne')),
      });
    } else if (
      modalData?.type === 'multiple' &&
      modalData?.action === 'unassign'
    ) {
      unassignTicketsMutate(modalData?.ids, {
        onSuccess: (returnedData) => {
          toast.success(t('tickets.success.unassign'));
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          setIsOpenModal(false);
        },
        onError: (err) => toast.error(t('tickets.errors.unassign')),
      });
    }
  };

  const isPendingCondition =
    isPendingSoftDeleteTicket ||
    isPendingSoftDeleteTickets ||
    isPendingUnassignTicket ||
    isPendingUnassignTickets;

  return (
    <>
      <ReusableTable<Ticket>
        queryKey={['tickets', id]}
        columns={columns}
        serverSide
        fetchData={(params) => fetchTickets(params, { userId: id })}
        idForRow={(row) => row?.documentId}
        is3Dots={false}
        rowActions={rowActions}
        bulkActions={bulkActions}
        errorMessage={t('tickets.errors.load')}
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
                : t('general.pending.unassigning')
              : modalData?.action === 'delete'
              ? t('general.text.delete')
              : t('general.text.unassign')}
          </Button>
        </div>
      </Modal>
    </>
  );
}

