import { BellRing } from 'lucide-react';

const NotificationsIcon = ({ unreadCount }: { unreadCount: number }) => {
  return (
    <div className="relative inline-block">
      <BellRing size={24} />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '+9' : unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationsIcon;
