import { useState } from 'react';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import PageHead from '../../../shared/components/page-head';
import PageAction from '../../../shared/components/page-action';
import { RotateCw, Trash2 } from 'lucide-react';
import DataDisplay from '../../../shared/components/data-display';
import useGetRecycledTicket from '../hooks/use-get-recycled-ticket';
import Modal from '../../../shared/components/modal';
import Button from '../../../shared/components/button';
import useRestoreTicket from '../hooks/use-restore-ticket';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import useHardDeleteTicket from '../hooks/use-hard-delete-ticket';
import useSendNotification from '../../notifications/hooks/use-send-notification';
import { useSocket } from '../../../hooks/use-socket';
import type { ModalDataType } from '../../../shared/types/modal';

const ViewRecycleTicket = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isError,
    isPending: isLoading,
    refetch,
  } = useGetRecycledTicket(String(id));
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState<ModalDataType>();

  const {
    mutate: hardDeleteTicketMutate,
    isPending: isPendingHardDeleteTicket,
  } = useHardDeleteTicket();

  const { mutate: restoreTicketMutate, isPending: isPendingRestoreTicket } =
    useRestoreTicket();

  const isPendingCondition =
    isPendingHardDeleteTicket || isPendingRestoreTicket;

  const { mutate: sendNotification } = useSendNotification();
  const { socket } = useSocket();

  const handleSubmit = () => {
    if (modalData?.action === 'delete') {
      hardDeleteTicketMutate(String(modalData?.id), {
        onSuccess: () => {
          toast.success(t('tickets.success.hardDeletedOne'));
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          setIsOpenModal(false);
          navigate(`/recycle-bin`);

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
        onError: () => toast.error(t('tickets.errors.hardDeletedOne')),
      });
    } else {
      restoreTicketMutate(String(modalData?.id), {
        onSuccess: () => {
          toast.success(t('tickets.success.restore'));
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          setIsOpenModal(false);
          navigate(`/tickets/${id}`);
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
        onError: () => toast.error(t('tickets.errors.restore')),
      });
    }
  };

  const deletedAt = new Date(data?.data?.deletedAt);
  const now = new Date();
  const diffMs = now.getTime() - deletedAt.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const remaining = Math.max(30 - diffDays, 0);

  return (
    <>
      <DashboardTopBar
        isPending={isLoading}
        breadcrumb={[
          { label: t('navbar.text.recycleBin'), href: '/recycle-bin' },
          { label: data?.data?.name || id, href: `/recycle-bin/${id}` },
        ]}
      />
      <DataDisplay
        data={data}
        isLoading={isLoading}
        refetch={refetch}
        error={isError ? t('tickets.errors.loadOneRecycle') : undefined}>
        <div className="flex gap-[24px] items-center mb-[32px] flex-wrap">
          <PageHead
            head={`${t('general.text.view')} ${t(
              'tickets.text.recycledTicket',
            )} (${data?.data?.name})`}
          />
          <div className="flex items-center gap-[16px]">
            <PageAction
              href={undefined}
              onClick={() => {
                setModalData({
                  head: t('tickets.text.deleteHardHead'),
                  description: t('tickets.text.deleteHardDescription', {
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
            <PageAction
              href={undefined}
              onClick={() => {
                setModalData({
                  head: t('tickets.text.restoreHead'),
                  description: t('tickets.text.restoreDescription', {
                    name: data?.data?.name,
                  }),
                  type: 'single',
                  action: 'restore',
                  value: data?.data,
                  id: data?.data?.documentId,
                });
                setIsOpenModal(true);
              }}>
              <RotateCw />
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-main-text-helper">
              {t('tickets.text.name')}
            </span>
            <span className="text-base text-main-text">
              {data?.data?.name || '-'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-main-text-helper">
              {t('tickets.text.state')}
            </span>
            <span className="text-base text-main-text">
              {data?.data?.state || '-'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-main-text-helper">
              {t('users.text.employee')}
            </span>
            <span className="text-base text-main-text">
              {data?.data?.user?.name || '-'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-main-text-helper">
              {t('tickets.text.remaining')}
            </span>
            <span className="text-base text-main-text">{remaining}</span>
          </div>
        </div>
      </DataDisplay>
    </>
  );
};

export default ViewRecycleTicket;

