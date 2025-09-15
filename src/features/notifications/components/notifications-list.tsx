import React, { useState } from 'react';
import Button from '../../../shared/components/button';
import useGetNotifications from '../hooks/use-get-notifications';
import Loading from '../../../shared/components/loading';
import { t } from 'i18next';
import useMarkAsRead from '../hooks/use-mark-as-read';
import NotificationItem from './notification-item';

interface Notification {
  id: number;
  head: string;
  description: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsListProps {
  userId: number;
}

const NotificationsList: React.FC<NotificationsListProps> = ({ userId }) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const params = {
    pageIndex: page - 1,
    userId: userId,
    pageSize: pageSize,
  };

  const { data, isPending, isError, isFetching } = useGetNotifications(params);

  if (isPending) return <Loading />;
  if (isError)
    return <p className="text-red-500">{t('notifications.errors.load')}</p>;

  const notifications: Notification[] = data?.data || [];

  const totalPages = Math.ceil(data?.total / pageSize);

  return (
    <div className="space-y-4 relative">
      {notifications.length === 0 && <p>{t('notifications.errors.zero')}</p>}

      {notifications.map((notif) => (
        <NotificationItem key={notif.id} notif={notif} />
      ))}

      {isFetching && (
        <div className="absolute inset-0 bg-main-background/30 flex items-center justify-center z-10">
          <Loading />
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="inverse"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}>
          {t('general.text.prev')}
        </Button>

        <div className="text-sm text-main-text-helper">
          {t('general.text.page')} {notifications.length === 0 ? 0 : page}{' '}
          {t('general.text.of')} {totalPages} | {t('general.text.total')}:{' '}
          {data?.total} {t('notifications.text.notifications')}
        </div>

        <Button
          onClick={() => setPage((page) => page + 1)}
          disabled={page >= totalPages}>
          {t('general.text.next')}
        </Button>
      </div>
    </div>
  );
};

export default NotificationsList;

