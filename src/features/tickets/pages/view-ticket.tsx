import React, { useState } from 'react';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHead from '../../../shared/components/page-head';
import PageAction from '../../../shared/components/page-action';
import useGetTicket from '../hooks/use-get-ticket';
import { Pencil, Trash2 } from 'lucide-react';
import DataDisplay from '../../../shared/components/data-display';
import useSoftDeleteTicket from '../hooks/use-soft-delete-ticket';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import Modal from '../../../shared/components/modal';
import Button from '../../../shared/components/button';

const ViewTicketPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isError, isPending: isLoading } = useGetTicket(id);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const {
    mutate: softDeleteTicketMutate,
    isPending: isPendingSoftDeleteTicket,
    isError: isErrorSoftDeleteTicket,
  } = useSoftDeleteTicket();

  const handleSubmit = () => {
    softDeleteTicketMutate(id, {
      onSuccess: (returnedData) => {
        toast.success(t('tickets.success.softDeletedOne'));
        queryClient.invalidateQueries({ queryKey: ['tickets'] });
        setIsOpenModal(false);
        navigate(`/tickets`);
      },
      onError: (err) => toast.error(t('tickets.errors.hardDeletedOne')),
    });
  };

  return (
    <>
      <DashboardTopBar
        isPending={isLoading}
        breadcrumb={[
          { label: t('navbar.text.tickets'), href: '/tickets' },
          { label: data?.data?.name || id, href: `/tickets/${id}` },
        ]}
      />
      <DataDisplay
        data={data}
        isLoading={isLoading}
        error={isError ? t('tickets.errors.loadOne') : undefined}>
        <div className="flex gap-[24px] items-center mb-[32px] flex-wrap">
          <PageHead
            head={`${t('general.text.view')} ${t('tickets.text.ticket')} (${
              data?.data?.name
            })`}
          />
          <div className="flex items-center gap-[16px]">
            <PageAction href={`/tickets/${id}/edit`}>
              <Pencil />
            </PageAction>
            <PageAction
              href={false}
              onClick={() => {
                setModalData({
                  head: t('tickets.text.deleteHead'),
                  description: t('tickets.text.deleteDescription', {
                    name: data?.data?.name,
                  }),
                  type: 'single',
                  action: 'delete',
                  value: data?.data,
                  id: data?.data?.documentId,
                });
                setIsOpenModal(true);
              }}>
              <Trash2 />
            </PageAction>
          </div>

          <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
            <h2 className="text-xl font-bold mb-4">{modalData?.head}</h2>
            <p>{modalData?.description}</p>
            <div className="flex gap-[16px] mt-[24px] flex-col sm:flex-row">
              <Button
                onClick={() => setIsOpenModal(false)}
                className={'w-full'}
                variant="inverse"
                disabled={isPendingSoftDeleteTicket}>
                {t('general.text.cancel')}
              </Button>
              <Button
                className={'w-full'}
                onClick={handleSubmit}
                disabled={isPendingSoftDeleteTicket}>
                {isPendingSoftDeleteTicket
                  ? t('general.pending.deleting')
                  : t('general.text.delete')}
              </Button>
            </div>
          </Modal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">
              {t('tickets.text.name')}
            </span>
            <span className="text-base text-gray-900">
              {data?.data?.name || '-'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">
              {t('tickets.text.state')}
            </span>
            <span className="text-base text-gray-900">
              {data?.data?.state || '-'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">
              {t('users.text.employee')}
            </span>
            {data?.data?.user?.id ? (
              <Link
                to={`/employees/${data?.data?.user?.id}`}
                className="text-base text-gray-900">
                {data?.data?.user?.name || '-'}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-500">-</span>
            )}
          </div>
        </div>
      </DataDisplay>
    </>
  );
};

export default ViewTicketPage;

