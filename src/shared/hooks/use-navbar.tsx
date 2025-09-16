import {
  CircleQuestionMark,
  CircleUserRound,
  LayoutDashboard,
  Settings,
  ShieldUser,
  StretchHorizontal,
  Ticket,
  Trash2,
  Users,
} from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import NotificationsIcon from '../components/notification-icon';
import useGetNotificationsCount from '../../features/notifications/hooks/use-get-notifications-count';
import useGetUnreadAllCountChats from '../../features/chats/hooks/use-get-unread-all-count';
import { decodeJwt, getCookie } from '../utils/auth';
import ChatsIcon from '../components/chat-icon';
import useUser from './use-user';

const useNavbar = () => {
  const { t } = useTranslation();

  const { isPending: isPendingMe, data: myData } = useUser();
  const id = myData?.id;
  const isOwnerManager = myData?.type === 'owner' || myData?.type === 'manager';
  const isOwner = myData?.type === 'owner';

  const {
    data: notificationsData,
    isError,
    isPending,
  } = useGetNotificationsCount(id);

  const {
    data: chatsCount,
    isError: isErrorChatsCount,
    isPending: isPendingChatsCount,
  } = useGetUnreadAllCountChats();

  const data = isOwner
    ? [
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
        {
          icon: <Users />,
          href: '/employees',
          text: t('navbar.text.employees'),
        },
        {
          icon: <ChatsIcon unreadCount={chatsCount?.totalUnread} />,
          href: '/chats',
          text: t('navbar.text.chats'),
        },
        {
          icon: (
            <NotificationsIcon
              unreadCount={notificationsData?.data?.unreadCount}
            />
          ),
          href: '/notifications',
          text: t('navbar.text.notifications'),
        },
        {
          icon: <StretchHorizontal />,
          href: '/plans',
          text: t('navbar.text.plans'),
        },
        {
          icon: <Settings />,
          href: '/settings',
          text: t('navbar.text.settings'),
        },
        {
          icon: <Trash2 />,
          href: '/recycle-bin',
          text: t('navbar.text.recycleBin'),
        },

        {
          icon: <CircleUserRound />,
          href: '/profile',
          text: t('navbar.text.profile'),
        },

        {
          icon: <CircleQuestionMark />,
          href: '/help',
          text: t('navbar.text.help'),
        },
      ]
    : isOwnerManager
    ? [
        {
          icon: <LayoutDashboard />,
          href: '/dashboard',
          text: t('navbar.text.dashboard'),
        },
        { icon: <Ticket />, href: '/tickets', text: t('navbar.text.tickets') },
        {
          icon: <Users />,
          href: '/employees',
          text: t('navbar.text.employees'),
        },
        {
          icon: <ChatsIcon unreadCount={chatsCount?.totalUnread} />,
          href: '/chats',
          text: t('navbar.text.chats'),
        },
        {
          icon: (
            <NotificationsIcon
              unreadCount={notificationsData?.data?.unreadCount}
            />
          ),
          href: '/notifications',
          text: t('navbar.text.notifications'),
        },
        {
          icon: <Settings />,
          href: '/settings',
          text: t('navbar.text.settings'),
        },
        {
          icon: <Trash2 />,
          href: '/recycle-bin',
          text: t('navbar.text.recycleBin'),
        },

        {
          icon: <CircleUserRound />,
          href: '/profile',
          text: t('navbar.text.profile'),
        },

        {
          icon: <CircleQuestionMark />,
          href: '/help',
          text: t('navbar.text.help'),
        },
      ]
    : [
        {
          icon: <LayoutDashboard />,
          href: '/dashboard',
          text: t('navbar.text.dashboard'),
        },
        { icon: <Ticket />, href: '/tickets', text: t('navbar.text.tickets') },
        {
          icon: <ChatsIcon unreadCount={chatsCount?.totalUnread} />,
          href: '/chats',
          text: t('navbar.text.chats'),
        },
        {
          icon: (
            <NotificationsIcon
              unreadCount={notificationsData?.data?.unreadCount}
            />
          ),
          href: '/notifications',
          text: t('navbar.text.notifications'),
        },

        {
          icon: <Settings />,
          href: '/settings',
          text: t('navbar.text.settings'),
        },

        {
          icon: <CircleUserRound />,
          href: '/profile',
          text: t('navbar.text.profile'),
        },

        {
          icon: <CircleQuestionMark />,
          href: '/help',
          text: t('navbar.text.help'),
        },
      ];

  return { data, isPendingMe };
};

export default useNavbar;

