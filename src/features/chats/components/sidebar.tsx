import { useState, useEffect } from 'react';
import { decodeJwt, getCookie } from '../../../shared/utils/auth';
import useMessagesSidebarStore from '../store/use-chat-sidebar';
import clsx from 'clsx';
import Input from '../../../shared/components/input';
import { useTranslation } from 'react-i18next';
import Button from '../../../shared/components/button';
import useGetUsersWithoutChat from '../hooks/use-get-users-without-chat';
import useGetUserChats from '../hooks/use-get-user-chats';
import useStartChat from '../hooks/use-start-chat';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import Loading from '../../../shared/components/loading';
import UnreadCircle from '../../../shared/components/unread-circle';
import useMarkAsRead from '../../notifications/hooks/use-mark-as-read';
import useMarkChatAsRead from '../hooks/use-mark-chat-as-read';
import { useTypingStore } from '../../../shared/store/use-typing-store';
import DataDisplay from '../../../shared/components/data-display';
import Refetch from '../../../shared/components/refetch';

type User = { id: number; username: string };
type Message = { id: number; text: string; sender: User };
type Chat = { id: number; user1: User; user2: User; messages: Message[] };

export default function ChatSidebar({
  setActiveChat,
  activeChat,
}: {
  setActiveChat: (chat: Chat) => void;
  activeChat: Chat | null;
}) {
  const [activeTab, setActiveTab] = useState<'chats' | 'users'>('chats');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isExpanded } = useMessagesSidebarStore();
  // const { typingUsers, setTypingUsers } = useTypingStore();
  const typingUsers = useTypingStore((state) => state.typingUsers);

  console.log('TYYY', typingUsers);

  // search + pagination
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const myId = decodeJwt(String(getCookie('token'))).id;

  const params = {
    search: debouncedSearch,
    page: page,
    limit: 10,
  };

  const {
    data: usersWithoutChat,
    isError: isErrorUsersWithoutChat,
    isPending: isPendingUsersWithoutChat,
    isFetching: isFetchingUsersWithoutChat,
    refetch: refetchUsersWithoutChat,
  } = useGetUsersWithoutChat(params);
  const {
    data: userChats,
    isError: isErrorUserChats,
    isPending: isPendingUserChats,
    isFetching: isFetchingUserChats,
    refetch: refetchUserChats,
  } = useGetUserChats(params);

  const {
    mutate: markAsRead,
    isPending: isPendingMarking,
    isError: isErrorMarking,
  } = useMarkChatAsRead();

  console.log('userChats', userChats);

  // debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const {
    mutate,
    isPending: isPendingStartChat,
    isError: isErrorStartChat,
  } = useStartChat();

  const handleStartChat = async (user: User) => {
    mutate(
      {
        userId: user.id,
        message: `Starting new chat with ${user.name}`,
      },
      {
        onSuccess: (returnedData) => {
          toast.success(t('chats.success.start'));
          setActiveTab('chats');

          queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
        onError: (err) => toast.error(t('chats.errors.start')),
      },
    );
  };

  const { setExpanded } = useMessagesSidebarStore();

  const handleSelectChat = async (chat) => {
    setActiveChat(chat);
    if (window.innerWidth <= 768) {
      setExpanded(false);
    }
    markAsRead(chat.id, {
      onSuccess: (returnedData) => {
        queryClient.invalidateQueries({ queryKey: ['chats'] });
      },
    });
  };

  const { t } = useTranslation();

  const chats = userChats?.data;
  const users = usersWithoutChat?.data;

  return (
    <>
      {true && (
        <div
          className={`h-full flex flex-col transition-all duration-300 gap-[16px] ${
            !isExpanded
              ? 'w-0 absolute left-0 top-0'
              : 'w-[100%] md:w-[320px] relative shrink-0'
          }`}>
          {isExpanded && (
            <>
              {/* Tabs */}
              <div className="flex border-b border-main-background bg-second-background/50 rounded-level1 overflow-hidden">
                <button
                  onClick={() => {
                    setActiveTab('chats');
                    setPage(1);
                  }}
                  className={`flex-1 py-2 text-center ${
                    activeTab === 'chats'
                      ? 'border-b-2 border-main bg-second-background font-bold'
                      : ''
                  }`}>
                  {t('chats.text.chats')}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('users');
                    setPage(1);
                  }}
                  className={`flex-1 py-2 text-center ${
                    activeTab === 'users'
                      ? 'border-b-2 border-main bg-second-background font-bold'
                      : ''
                  }`}>
                  {t('chats.text.users')}
                </button>
              </div>

              {/* Search */}
              <div className="">
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder={`${t('chats.text.search')} ${t(
                    `chats.text.${activeTab}`,
                  )}`}
                />
              </div>

              {/* Tab content */}
              <div className="overflow-y-auto p-2 bg-second-background rounded-level1 flex-1 justify-center items-center">
                {/* {(isFetchingUserChats || isFetchingUsersWithoutChat) &&
                  !isPendingStartChat &&
                  !isPendingUserChats && (
                    <div className="absolute inset-0 bg-main-background/30 flex items-center justify-center z-10">
                      <Loading />
                    </div>
                  )} */}

                {isPendingUserChats || isPendingUsersWithoutChat ? (
                  <div className="absolute inset-0 bg-second-background flex items-center justify-center z-10">
                    <Loading />
                  </div>
                ) : activeTab === 'chats' ? (
                  <ul className="divide-y divide-main-background flex flex-col gap-[8px] ">
                    {isErrorUserChats && (
                      <div className="flex items-center gap-[16px]">
                        <p> {t('chats.errors.loadChats')}</p>
                        <Refetch refetch={refetchUserChats} />
                      </div>
                    )}

                    {!isErrorUserChats &&
                      chats?.map((chat) => {
                        const otherUser =
                          chat?.user1?.id !== myId ? chat.user1 : chat.user2;
                        const lastMessage =
                          chat?.messages[chat.messages.length - 1];
                        return (
                          <li
                            key={chat.id}
                            className={clsx(
                              'p-2 rounded-level1 cursor-pointer relative flex justify-between items-center',
                              chat.id === activeChat?.id
                                ? 'bg-main-hover/20'
                                : 'hover:bg-main-background',
                            )}
                            onClick={() => handleSelectChat(chat)}>
                            <div>
                              <p className="font-semibold truncate max-w-[240px] sm:max-w-[280px]">
                                {otherUser.name}
                              </p>
                              <p className="text-sm text-main-text-hover truncate max-w-[240px] sm:max-w-[280px]">
                                {Array.isArray(typingUsers) &&
                                typingUsers.some(
                                  (u) => u.id === otherUser?.id,
                                ) ? (
                                  <span className="text-main-text-hover font-medium">
                                    {t('general.pending.typing')}
                                  </span>
                                ) : lastMessage ? (
                                  lastMessage.text
                                ) : (
                                  'No messages yet'
                                )}
                              </p>
                            </div>
                            <UnreadCircle
                              unreadCount={chat?.unreadCount}
                              relative={true}
                            />
                          </li>
                        );
                      })}
                  </ul>
                ) : (
                  <ul className="divide-y divide-main-background flex flex-col gap-[8px]">
                    {isErrorUsersWithoutChat && (
                      <div className="flex items-center gap-[16px]">
                        <p> {t('chats.errors.loadUsers')}</p>
                        <Refetch refetch={refetchUsersWithoutChat} />
                      </div>
                    )}
                    {!isErrorUsersWithoutChat &&
                      users?.map((user) => (
                        <li
                          key={user.id}
                          className="p-2 rounded-level1 hover:bg-main-background cursor-pointer flex items-start justify-between flex-col gap-[8px]"
                          onClick={() =>
                            setSelectedUser(
                              selectedUser?.id === user.id ? null : user,
                            )
                          }>
                          <div className="flex flex-col ">
                            <span className="font-bold truncate max-w-[180px] sm:max-w-[280px]">
                              {user.name}
                            </span>
                            <span className="text-main-text-hover truncate max-w-[180px] sm:max-w-[280px]">
                              @{user.username}
                            </span>
                          </div>

                          {selectedUser?.id === user.id && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartChat(user);
                              }}
                              disabled={isPendingStartChat}>
                              {isPendingStartChat
                                ? t('general.pending.starting')
                                : t('general.text.start')}
                            </Button>
                          )}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center p-2 border-t border-main-background bg-second-background rounded-level1">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-main-background rounded disabled:opacity-50">
                  {t('general.text.prev')}
                </button>
                <span className="text-sm">
                  {page} {t('general.text.of')} {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                  disabled={page >= totalPages}
                  className="px-3 py-1 bg-main-background rounded disabled:opacity-50">
                  {t('general.text.next')}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

