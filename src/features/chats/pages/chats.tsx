import { useTranslation } from 'react-i18next';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import ChatSidebar from '../components/sidebar';
import ChatView from '../components/chat-view';
import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import useMessagesSidebarStore from '../store/use-chat-sidebar';
import useMarkAllChatsAsRead from '../hooks/use-mark-all-chats-as-read';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import useGetUnreadAllCountChats from '../hooks/use-get-unread-all-count';

const ChatsPage = () => {
  const { t } = useTranslation();
  const breadCrumb = [{ label: t('navbar.text.chats'), href: '/chats' }];

  const [activeChat, setActiveChat] = useState(null);
  const { isExpanded, toggleSidebar } = useMessagesSidebarStore();
  const [typingUsers, setTypingUsers] = useState([]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1280);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { mutate, isPending, isError } = useMarkAllChatsAsRead();

  const {
    data: chatsCount,
    isError: isErrorChatsCount,
    isPending: isPendingChatsCount,
  } = useGetUnreadAllCountChats();

  const handleMarking = () => {
    mutate(undefined, {
      onSuccess: (returnedData) => {
        toast.success(t('chats.success.markAll'));

        queryClient.invalidateQueries({ queryKey: ['chats'] });
      },
      onError: (err) => toast.error(t('chats.errors.markAll')),
    });
  };

  return (
    <>
      <DashboardTopBar breadcrumb={breadCrumb}>
        {/* Toggle chat sidebar button */}
        <div className="flex justify-between w-full gap-[8px]">
          <button onClick={toggleSidebar} className="">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button
            disabled={chatsCount?.totalUnread === 0}
            onClick={handleMarking}
            className="disabled:opacity-30 truncate">
            {isPending
              ? t('general.pending.marking')
              : t('general.text.markAll')}
          </button>
        </div>
      </DashboardTopBar>
      <div className="flex gap-[16px] h-[calc(100vh-108px)]">
        <ChatSidebar setActiveChat={setActiveChat} activeChat={activeChat} />
        <ChatView chat={activeChat} />
      </div>
    </>
  );
};

export default ChatsPage;

