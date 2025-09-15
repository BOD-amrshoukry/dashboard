import {
  BellRing,
  CircleUserRound,
  LayoutDashboard,
  Settings,
  ShieldUser,
  Ticket,
  Users,
  Menu,
  X,
  Trash2,
  StretchHorizontal,
  CircleQuestionMark, // add the X icon from lucide-react
} from 'lucide-react';
import useSidebarStore from '../store/use-sidebar-store';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import UserDetailsSidebar from '../components/user-details-sidebar';
import useGetNotificationsCount from '../../features/notifications/hooks/use-get-notifications-count';
import { decodeJwt, getCookie } from '../utils/auth';
import NotificationsIcon from '../components/notification-icon';
import PushNotification from '../../components/push-notification';

const DashboardLayout = () => {
  const { isExpanded, toggleSidebar } = useSidebarStore();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.dir() === 'rtl';
  const id = decodeJwt(String(getCookie('token'))).id;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    data: notificationsData,
    isError,
    isPending,
  } = useGetNotificationsCount(id);

  const data = [
    {
      icon: <LayoutDashboard />,
      href: '/dashboard',
      text: t('navbar.text.dashboard'),
    },
    { icon: <Ticket />, href: '/tickets', text: t('navbar.text.tickets') },
    {
      icon: <ShieldUser />,
      href: '/managers',
      text: t('navbar.text.managers'),
    },
    { icon: <Users />, href: '/employees', text: t('navbar.text.employees') },
    {
      icon: <CircleUserRound />,
      href: '/profile',
      text: t('navbar.text.profile'),
    },
    {
      icon: (
        <NotificationsIcon unreadCount={notificationsData?.data?.unreadCount} />
      ),
      href: '/notifications',
      text: t('navbar.text.notifications'),
    },
    {
      icon: <StretchHorizontal />,
      href: '/plans',
      text: t('navbar.text.plans'),
    },

    { icon: <Settings />, href: '/settings', text: t('navbar.text.settings') },
    {
      icon: <Trash2 />,
      href: '/recycle-bin',
      text: t('navbar.text.recycleBin'),
    },
    {
      icon: <CircleQuestionMark />,
      href: '/help',
      text: t('navbar.text.help'),
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'flex flex-col fixed min-h-screen p-[12px] z-[990] transition-transform duration-300',
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
                'absolute top-[28px]  p-2 rounded-full hover:bg-nav-hover transition-[0.5s] cursor-pointer',
                isRTL ? 'left-4' : 'right-4',
              )}>
              <X size={20} />
            </button>
          )}

          <div>
            <div className="p-[16px]">
              <h2 className="text-[24px] font-bold text-main">
                {t('navbar.text.logo')}
              </h2>
            </div>
            <ul className="flex flex-col gap-[8px] px-[8px] mt-4">
              {data.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={clsx(
                      'flex items-center gap-[8px] px-[8px] py-[8px] rounded-level1 transition-[0.5s]',
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

          <UserDetailsSidebar isMobile={isMobile} />
        </div>
      </aside>

      <main
        className={clsx(
          'transition-all duration-300',
          'min-h-[calc(100vh-32px)]',
          'pt-[96px] pb-[32px]',
          isRTL
            ? isExpanded
              ? 'pr-[336px] pl-[12px]'
              : 'pr-[16px] pl-[16px]'
            : isExpanded
            ? 'pl-[336px] pr-[12px]'
            : 'pl-[16px] pr-[16px]',
        )}>
        <Outlet />
        <PushNotification userId={id} />
      </main>
    </>
  );
};

export default DashboardLayout;

