import useMarkAsRead from '../hooks/use-mark-as-read';
import { queryClient } from '../../../lib/tanstackquery';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '../../../shared/components/button';
import type { Notification } from '../types/types';

const NotificationItem = ({ notif }: { notif: Notification }) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useMarkAsRead();

  const handleMark = () => {
    mutate(notif.documentId, {
      onSuccess: () => {
        toast.success(t('notifications.success.mark'));
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
      onError: () => toast.error(t('notifications.errors.mark')),
    });
  };

  return (
    <div
      key={notif.id}
      className={`p-4 rounded-lg ${
        notif.isRead ? 'bg-second-background' : 'bg-main-hover/20'
      }`}>
      <div className="flex items-start justify-between flex-wrap gap-[24px]">
        <div>
          <h4 className="font-bold text-[24px] text-main-text">{notif.head}</h4>
          <p className="text-main-text">{notif.description}</p>
          <p className="text-xs text-main-text-helper mt-[16px]">
            {new Date(notif.createdAt).toLocaleString()}
          </p>
        </div>
        {!notif.isRead && (
          <div>
            <Button
              onClick={handleMark}
              variant="inverse"
              className="min-w-fit bg-main-background/50!">
              {isPending
                ? t('general.pending.marking')
                : t('general.text.mark')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;

