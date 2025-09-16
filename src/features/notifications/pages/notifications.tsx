import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import { useTranslation } from 'react-i18next';
import PageHead from '../../../shared/components/page-head';
import NotificationsList from '../components/notifications-list';
import useMarkAllAsRead from '../hooks/use-mark-all-as-read';
import PageAction from '../../../shared/components/page-action';
import { decodeJwt, getCookie } from '../../../shared/utils/auth';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import useGetNotificationsCount from '../hooks/use-get-notifications-count';
import DataDisplay from '../../../shared/components/data-display';

const NotificationsPage = () => {
  const { t } = useTranslation();
  const breadCrumb = [
    { label: t('navbar.text.notifications'), href: '/notifications' },
  ];

  const id = decodeJwt(String(getCookie('token'))).id;

  const { mutate, isPending: isPendingMarking } = useMarkAllAsRead();

  const handleMarkAll = () => {
    mutate(id, {
      onSuccess: () => {
        toast.success(t('notifications.success.markAll'));
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
      onError: () => toast.error(t('notifications.errors.markAll')),
    });
  };

  const { isPending, isError, data, refetch } = useGetNotificationsCount(id);

  console.log(data);

  return (
    <>
      <DashboardTopBar breadcrumb={breadCrumb} />
      <div className="flex gap-[24px] items-center mb-[32px] flex-wrap">
        <PageHead head={t('navbar.text.notifications')} />
        <DataDisplay
          data={data}
          refetch={refetch}
          isLoading={isPending}
          error={isError ? t('notifications.errors.loadCount') : undefined}>
          <PageAction
            href={undefined}
            onClick={handleMarkAll}
            disabled={data?.data?.unreadCount === 0}>
            {isPendingMarking
              ? t('general.pending.marking')
              : t('notifications.text.markAll')}
          </PageAction>
        </DataDisplay>
      </div>

      <div className="mt-[32px]">
        <NotificationsList userId={id} />
      </div>
    </>
  );
};

export default NotificationsPage;

