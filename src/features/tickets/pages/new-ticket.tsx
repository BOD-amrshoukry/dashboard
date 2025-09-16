import { useTranslation } from 'react-i18next';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import PageHead from '../../../shared/components/page-head';
import TicketForm from '../components/ticket-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCreateOrUpdateTicket from '../hooks/use-create-or-edit-ticket';
import { queryClient } from '../../../lib/tanstackquery';
import useSendNotification from '../../notifications/hooks/use-send-notification';
import { useSocket } from '../../../hooks/use-socket';

const NewTicketPage = () => {
  const { t } = useTranslation();
  const { mutate, isPending } = useCreateOrUpdateTicket();
  const navigate = useNavigate();
  const { mutate: sendNotification } = useSendNotification();
  const { socket } = useSocket();

  const breadcrumb = [
    { label: t('navbar.text.tickets'), href: '/tickets' },
    { label: t('general.text.new'), href: '/tickets/new' },
  ];

  const handleSubmit = (formData: any) => {
    mutate(
      { data: formData },
      {
        onSuccess: (returnedData) => {
          toast.success(t('tickets.success.new'));
          const id = returnedData.data.documentId;
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
          navigate(`/tickets/${id}`);
          if (formData?.user) {
            sendNotification({
              userId: formData?.user,
              title: t('notifications.text.assignHead'),
              message: t('notifications.text.assignDescription', {
                name: formData?.name,
              }),
            });
            if (socket) {
              console.log('I AM A SOCKET');
              socket.emit('sendNotification', {
                recipientId: formData.user,
                data: {
                  title: t('notifications.text.assignHead'),
                  message: t('notifications.text.assignDescription', {
                    name: formData?.name,
                  }),
                },
              });
            }
          }
        },
        onError: () => toast.error(t('tickets.errors.new')),
      },
    );
  };

  return (
    <>
      <DashboardTopBar breadcrumb={breadcrumb} />
      <PageHead head={t('tickets.text.newTicket')} />
      <div className="mt-[32px]">
        <TicketForm
          type="new"
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel={t('general.text.create')}
        />
      </div>
    </>
  );
};

export default NewTicketPage;

