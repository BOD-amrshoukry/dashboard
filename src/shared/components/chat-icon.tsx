import { MessageCircleMore } from 'lucide-react';
import UnreadCircle from './unread-circle';

const ChatsIcon = ({ unreadCount }: { unreadCount: number }) => {
  return (
    <div className="relative inline-block">
      <MessageCircleMore size={24} />
      <UnreadCircle unreadCount={unreadCount} />
    </div>
  );
};

export default ChatsIcon;

