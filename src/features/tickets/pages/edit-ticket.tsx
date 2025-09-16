import { useTranslation } from 'react-i18next';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import PageHead from '../../../shared/components/page-head';
import TicketForm from '../components/ticket-form';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCreateOrUpdateTicket from '../hooks/use-create-or-edit-ticket';
import { queryClient } from '../../../lib/tanstackquery';
import useGetTicket from '../hooks/use-get-ticket';
import DataDisplay from '../../../shared/components/data-display';
import useSendNotification from '../../notifications/hooks/use-send-notification';
import { useSocket } from '../../../hooks/use-socket';

const EditTicketPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateOrUpdateTicket();

  console.log('id', id);

  const { data, isError, isPending: isLoading, refetch } = useGetTicket(id);
  const { mutate: sendNotification } = useSendNotification();
  const { socket } = useSocket();

  console.log('ASXX', data?.data);
  const handleSubmit = (formData: any) => {
    mutate(
      { id: id, data: formData },
      {
        onSuccess: () => {
          toast.success(t('tickets.success.edit'));
          if (data?.data?.user?.id) {
            if (data?.data?.user?.id !== formData?.user) {
              sendNotification({
                userId: data?.data?.user?.id,
                title: t('notifications.text.unassignHead'),
                message: t('notifications.text.unassignDescription', {
                  name: formData?.name,
                }),
              });
              if (socket) {
                socket.emit('sendNotification', {
                  recipientId: data?.data?.user?.id,
                  data: {
                    title: t('notifications.text.unassignHead'),
                    message: t('notifications.text.unassignDescription', {
                      name: formData?.name,
                    }),
                  },
                });
              }
            }
          }
          if (formData?.user) {
            if (data?.data?.user?.id !== formData?.user) {
              sendNotification({
                userId: formData?.user,
                title: t('notifications.text.assignHead'),
                message: t('notifications.text.assignDescription', {
                  name: formData?.name,
                }),
              });
              if (socket) {
                socket.emit('sendNotification', {
                  recipientId: formData?.user,
                  data: {
                    title: t('notifications.text.assignHead'),
                    message: t('notifications.text.assignDescription', {
                      name: formData?.name,
                    }),
                  },
                });
              }
            }
          }
          if (data?.data?.user?.id && data?.data?.user?.id === formData?.user) {
            sendNotification({
              userId: formData?.user,
              title: t('notifications.text.ticketEditHead'),
              message: t('notifications.text.ticketEditDescription', {
                name: formData?.name,
              }),
            });
            if (socket) {
              socket.emit('sendNotification', {
                recipientId: formData?.user,
                data: {
                  title: t('notifications.text.ticketEditHead'),
                  message: t('notifications.text.ticketEditDescription', {
                    name: formData?.name,
                  }),
                },
              });
            }
          }
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          navigate(`/tickets/${id}`);
        },
        onError: () => toast.error(t('tickets.errors.edit')),
      },
    );
  };

  const onInvalid = (error) => {
    console.log(error);
  };

  const defaultValues = {
    name: data?.data?.name,
    state: data?.data?.state,
    user: data?.data?.user?.id || null,
  };

  return (
    <>
      <DashboardTopBar
        isPending={isLoading}
        breadcrumb={[
          { label: t('navbar.text.tickets'), href: '/tickets' },
          { label: data?.data?.name || id, href: `/tickets/${id}` },
          { label: t('general.text.edit'), href: `/tickets/${id}/edit` },
        ]}
      />
      <DataDisplay
        data={data}
        refetch={refetch}
        isLoading={isLoading}
        error={isError ? t('tickets.errors.loadOne') : undefined}>
        <PageHead
          head={`${t('general.text.edit')} ${t('tickets.text.ticket')} (${
            data?.data?.name
          })`}
        />

        <div className="mt-[32px]">
          <TicketForm
            type="edit"
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isPending={isPending}
            submitLabel={t('general.text.update')}
            userValue={data?.data?.user}
            onInvalid={onInvalid}
          />
        </div>
      </DataDisplay>
    </>
  );
};

export default EditTicketPage;

