import useSidebarStore from '../store/use-sidebar-store';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import UserDetailsSidebar from '../components/user-details-sidebar';
import { decodeJwt, getCookie } from '../utils/auth';
import PushNotification from '../../components/push-notification';
import useGetAllUserChats from '../../features/chats/hooks/use-get-all-user-chats';
import { useSocket } from '../../hooks/use-socket';
import { queryClient } from '../../lib/tanstackquery';
import { useTypingStore } from '../store/use-typing-store';
import toast from 'react-hot-toast';
import useNavbar from '../hooks/use-navbar';
import RouteWatcher from '../components/route-watcher';
import { X } from 'lucide-react';

const DashboardLayout = () => {
  const { isExpanded, toggleSidebar } = useSidebarStore();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.dir() === 'rtl';
  const token = decodeJwt(String(getCookie('token')));
  const id = token.id;

  const { socket } = useSocket();
  const { data: chats } = useGetAllUserChats();

  // const { typingUsers, setTypingUsers } = useTypingStore();
  const typingUsers = useTypingStore((state) => state.typingUsers);
  const addTypingUser = useTypingStore((state) => state.addTypingUser);
  const removeTypingUser = useTypingStore((state) => state.removeTypingUser);

  useEffect(() => {
    console.log('Typing users from store:', typingUsers);
  }, [typingUsers]);

  useEffect(() => {
    console.log('isEpanded from store:', isExpanded);
  }, [isExpanded]);

  const allChats = chats?.data;

  useEffect(() => {
    if (!socket || !allChats) return;

    socket.on('receiveNotification', (notif) => {
      console.log('notif', notif);
      console.log('id', id);

      if (notif.recipientId == id) {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        toast.custom((to) => (
          <div
            className={`${
              to.visible ? 'animate-custom-enter' : 'animate-custom-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">🔔</div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notif.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{notif.message}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(to.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {t('general.text.close')}
              </button>
            </div>
          </div>
        ));
      }
      // You can also update a Zustand store or React state here
    });

    socket.emit('joinNotificationRoom');

    // Join all chat rooms
    allChats.forEach((chat: { id: string }) => {
      socket.emit('joinChat', chat.id);
    });

    // Listen for incoming messages in any chat
    socket.on('receiveMessage', (msg) => {
      console.log('Received message in chat:', msg.chat);
      queryClient.invalidateQueries({ queryKey: ['chats'] }); // update chat list
    });

    // Listen for typing events in any chat
    socket.on('userTyping', ({ user }) => {
      if (user.id !== id && !typingUsers?.some((u) => u.id === user.id)) {
        addTypingUser(user);
      }
    });

    socket.on('userStopTyping', ({ user }) => {
      console.log('REMOO');
      removeTypingUser(user);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userTyping');
      socket.off('userStopTyping');
    };
  }, [socket, allChats]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data } = useNavbar();

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[100] transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'flex flex-col fixed min-h-screen p-[12px] z-[100] transition-transform duration-300',
          isMobile && 'bg-second-background',
          isMobile
            ? isExpanded
              ? isRTL
                ? 'translate-x-0 right-0 w-[320px]' // mobile drawer open RTL
                : 'translate-x-0 left-0 w-[320px]' // mobile drawer open LTR
              : isRTL
              ? 'translate-x-full right-0 w-[320px]' // mobile drawer hidden RTL
              : '-translate-x-full left-0 w-[320px]' // mobile drawer hidden LTR
            : isExpanded
            ? isRTL
              ? 'translate-x-0 right-0 w-[320px]' // desktop visible RTL
              : 'translate-x-0 left-0 w-[320px]' // desktop visible LTR
            : isRTL
            ? 'translate-x-full right-0 w-[320px]' // desktop hidden RTL
            : '-translate-x-full left-0 w-[320px]', // desktop hidden LTR
        )}>
        <div className="flex flex-col min-h-[calc(100vh-24px)] bg-second-background rounded-level1 justify-between">
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className={clsx(
                'absolute top-[28px]  p-2 rounded-full hover:bg-nav-hover duration-300 cursor-pointer',
                isRTL ? 'left-4' : 'right-4',
              )}>
              <X size={20} />
            </button>
          )}

          <div>
            <div className="p-[16px] h-[64px] ">
              <h2 className="text-[24px] font-bold text-main">
                {t('navbar.text.logo')}
              </h2>
            </div>
            <ul className="flex flex-col gap-[8px] px-[8px] mt-4 max-h-[calc(100vh-64px-64px-64px-16px)] overflow-y-auto">
              {/* {isPendingMe && <Loading />} */}
              {data.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={clsx(
                      'flex items-center gap-[8px] px-[8px] py-[8px] rounded-level1 duration-300',
                      location.pathname === item.href
                        ? 'bg-main text-text-secondary'
                        : 'hover:bg-nav-hover',
                    )}
                    onClick={() => isMobile && toggleSidebar()}>
                    {item.icon}
                    <p>{item.text}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <RouteWatcher />

          <UserDetailsSidebar isMobile={isMobile} />
        </div>
      </aside>

      <main
        className={clsx(
          'transition-all duration-300',
          'min-h-[calc(100vh-32px)]',
          'pt-[96px]',
          isRTL
            ? isExpanded
              ? 'pr-[336px] pl-[16px]'
              : 'pr-[16px] pl-[16px]'
            : isExpanded
            ? 'pl-[336px] pr-[16px]'
            : 'pl-[16px] pr-[16px]',
        )}>
        <Outlet />
        <PushNotification userId={id} />
      </main>
    </>
  );
};

export default DashboardLayout;

