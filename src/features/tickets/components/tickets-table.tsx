// src/pages/TicketsTable.tsx

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Column, FetchParams } from '../../tables/types/table';
import type { Ticket } from '../types/type';
import { useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import useSoftDeleteTicket from '../hooks/use-soft-delete-ticket';
import useSoftDeleteTickets from '../hooks/use-soft-delete-tickets';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import { ReusableTable } from '../../../shared/components/table';
import Modal from '../../../shared/components/modal';
import Button from '../../../shared/components/button';
import { fetchTickets } from '../services/get';
import useTicketStates from '../hooks/use-ticket-states';
import useSendNotification from '../../notifications/hooks/use-send-notification';
import { useSocket } from '../../../hooks/use-socket';
import useUser from '../../../shared/hooks/use-user';
import DataDisplay from '../../../shared/components/data-display';

export default function TicketsTable() {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const options = useTicketStates();
  const {
    isPending: myPending,
    data: myData,
    isError: myError,
    refetch,
  } = useUser();
  const isEmployee = myData?.type === 'employee';
  const id = myData?.id;

  console.log('MYDATA', myData);

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

  const rowActions = isEmployee
    ? [
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
      ]
    : [
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
      ];

  const bulkActions = isEmployee
    ? null
    : [
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
    mutate: softDeleteTicketMutate,
    isPending: isPendingSoftDeleteTicket,
    isError: isErrorSoftDeleteTicket,
  } = useSoftDeleteTicket();
  const {
    mutate: softDeleteTicketsMutate,
    isPending: isPendingSoftDeleteTickets,
    isError: isErrorSoftDeleteTickets,
  } = useSoftDeleteTickets();

  const { mutate: sendNotification } = useSendNotification();
  const { socket } = useSocket();

  const handleSubmit = () => {
    if (modalData?.type === 'single') {
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
    } else {
      softDeleteTicketsMutate(modalData?.ids, {
        onSuccess: (returnedData) => {
          toast.success(t('tickets.success.softDeleted'));
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          queryClient.invalidateQueries({ queryKey: ['recycle'] });
          setIsOpenModal(false);
        },
        onError: (err) => toast.error(t('tickets.errors.softDeleted')),
      });
    }
  };

  const isPendingCondition =
    isPendingSoftDeleteTicket || isPendingSoftDeleteTickets;

  const fetchTicketsForRole = (params: FetchParams, options?: any) => {
    // Build options dynamically
    const fetchOptions: { userType?: string; userId?: string } = {
      ...options, // keep any other options
    };

    // Conditionally add userType and userId only for employees
    if (isEmployee) {
      fetchOptions.userType = 'employee';
      fetchOptions.userId = id; // current logged-in user ID
    }

    return fetchTickets(params, fetchOptions);
  };

  return (
    <>
      <DataDisplay isLoading={myPending} data={myData} refetch={refetch}>
        <ReusableTable<Ticket>
          queryKey="tickets"
          columns={columns}
          serverSide
          fetchData={fetchTicketsForRole}
          idForRow={(row) => row?.documentId}
          is3Dots={false}
          rowActions={rowActions}
          bulkActions={bulkActions}
          errorMessage={t('tickets.errors.load')}
          loadingState={myPending}
        />
      </DataDisplay>

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
              ? t('general.pending.deleting')
              : t('general.text.delete')}
          </Button>
        </div>
      </Modal>
    </>
  );
}

