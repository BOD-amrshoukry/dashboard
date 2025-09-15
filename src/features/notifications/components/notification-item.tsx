import React from 'react';
import useMarkAsRead from '../hooks/use-mark-as-read';
import { queryClient } from '../../../lib/tanstackquery';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const NotificationItem = ({ notif }) => {
  const { t } = useTranslation();
  const { mutate, isPending, isError } = useMarkAsRead();

  const handleMark = () => {
    mutate(notif.documentId, {
      onSuccess: (returnedData) => {
        toast.success(t('notifications.success.mark'));
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
      onError: (err) => toast.error(t('notifications.errors.mark')),
    });
  };

  return (
    <div
      key={notif.id}
      className={`p-4 rounded-lg ${
        notif.isRead ? 'bg-second-background' : 'bg-disabled'
      }`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-bold text-[24px] text-main-text">{notif.head}</h4>
          <p className="text-main-text">{notif.description}</p>
          <p className="text-xs text-main-text-helper mt-[16px]">
            {new Date(notif.createdAt).toLocaleString()}
          </p>
        </div>
        {!notif.isRead && (
          <div>
            <button onClick={handleMark}>
              {isPending
                ? t('general.pending.marking')
                : t('general.text.mark')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;

