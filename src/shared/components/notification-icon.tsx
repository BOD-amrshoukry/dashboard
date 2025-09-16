import { BellRing } from 'lucide-react';
import UnreadCircle from './unread-circle';

const NotificationsIcon = ({ unreadCount }: { unreadCount: number }) => {
  return (
    <div className="relative inline-block">
      <BellRing size={24} />

      <UnreadCircle unreadCount={unreadCount} />
    </div>
  );
};

export default NotificationsIcon;

