// src/pages/TicketsPage.tsx
import type { Ticket } from '../../features/tables/types/tickets';
import type { Column } from '../../features/tables/types/table';
import { ReusableTable } from './table';
import { useNavigate } from 'react-router-dom';
import Modal from './modal';
import { useState } from 'react';
import Button from './button';
import { useTranslation } from 'react-i18next';
import { Eye, Pencil, RotateCw, Trash, Trash2 } from 'lucide-react';
import useSoftDeleteTicket from '../../features/tickets/hooks/use-soft-delete-ticket';
import useSoftDeleteTickets from '../../features/tickets/hooks/use-soft-delete-tickets';
import toast from 'react-hot-toast';
import { queryClient } from '../../lib/tanstackquery';
import { fetchTickets } from '../../features/tickets/services/get';

export default function TicketsPage() {
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

  const handleSubmit = () => {
    if (modalData?.type === 'single') {
      console.log('MODALSIGN', modalData);
      softDeleteTicketMutate(modalData?.ids, {
        onSuccess: (returnedData) => {
          toast.success(t('tickets.success.softDeletedOne'));
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          setIsOpenModal(false);
        },
        onError: (err) => toast.error(t('tickets.errors.softDeletedOne')),
      });
    } else {
      softDeleteTicketsMutate(modalData?.ids, {
        onSuccess: (returnedData) => {
          toast.success(t('tickets.success.softDeleted'));
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          setIsOpenModal(false);
        },
        onError: (err) => toast.error(t('tickets.errors.softDeleted')),
      });
    }
  };

  const isPendingCondition =
    isPendingSoftDeleteTicket || isPendingSoftDeleteTickets;

  return (
    <>
      <ReusableTable<Ticket>
        queryKey="tickets"
        columns={columns}
        serverSide
        fetchData={fetchTickets}
        idForRow={(row) => row?.documentId}
        is3Dots={false}
        rowActions={rowActions}
        bulkActions={bulkActions}
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
              ? t('general.pending.deleting')
              : t('general.text.delete')}
          </Button>
        </div>
      </Modal>
    </>
  );
}

