import React, { useState } from 'react';
import Button from '../../../shared/components/button';
import useGetNotifications from '../hooks/use-get-notifications';
import Loading from '../../../shared/components/loading';
import { t } from 'i18next';
import NotificationItem from './notification-item';
import DataDisplay from '../../../shared/components/data-display';
import type { Notification } from '../types/types';

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

  const { data, isPending, isFetching, refetch } = useGetNotifications(params);

  const notifications: Notification[] = data?.data || [];

  const totalPages = Math.ceil(data?.total / pageSize);

  return (
    <DataDisplay
      isLoading={isPending}
      error={t('notifications.errors.load')}
      data={data}
      refetch={refetch}>
      <div className="space-y-4 relative">
        {notifications.length === 0 && <p>{t('notifications.errors.zero')}</p>}

        {notifications.map((notif: Notification) => (
          <NotificationItem key={notif?.id} notif={notif} />
        ))}

        {isFetching && (
          <div className="absolute inset-0 bg-main-background/30 flex items-center justify-center z-10">
            <Loading />
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 flex-wrap gap-[24px]">
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
    </DataDisplay>
  );
};

export default NotificationsList;

