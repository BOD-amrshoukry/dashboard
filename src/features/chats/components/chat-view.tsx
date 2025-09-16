import { useState, useEffect, useRef } from 'react';
import api from '../../../lib/axios';
import { decodeJwt, getCookie } from '../../../shared/utils/auth';
import { BASE_URL } from '../../../shared/constants/api';
import Button from '../../../shared/components/button';
import Input from '../../../shared/components/input';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Send } from 'lucide-react';
import useSendMessage from '../hooks/use-send-message';
import { queryClient } from '../../../lib/tanstackquery';
import toast from 'react-hot-toast';
import useGetUserChat from '../hooks/use-get-chat';
import clsx from 'clsx';
import { formatDate } from '../../../shared/utils/time';
import useInfiniteChat from '../hooks/use-get-chat';
import Loading from '../../../shared/components/loading';
import DataDisplay from '../../../shared/components/data-display';
import { useSocket } from '../../../hooks/use-socket';
import { useTypingStore } from '../../../shared/store/use-typing-store';
import useMarkChatAsRead from '../hooks/use-mark-chat-as-read';
import useMessagesSidebarStore from '../store/use-chat-sidebar';

export default function ChatView({ chat }) {
  console.log('CHAT', chat);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { socket } = useSocket();
  const typingUsers = useTypingStore((state) => state.typingUsers);

  const {
    mutate: markAsRead,
    isPending: isPendingMarkAsRead,
    isError: isErrorMarkAsRead,
  } = useMarkChatAsRead();

  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  useEffect(() => {
    if (!chat?.id || !socket) return;

    // Join chat room
    socket.emit('joinChat', chat?.id);

    // Listen for incoming messages
    socket.on('receiveMessage', (chatId) => {
      console.log('SS', chatId, chat?.id);
      if (chatId === chat?.id) {
        markAsRead(chatId, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
          },
        });
      }
      console.log('REECCC');
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    });

    // socket.on('userTyping', ({ user }) => {
    //   if (user.id !== myId && !typingUsers?.some((u) => u.id === user.id)) {
    //     setTypingUsers((prev) => [...prev, user]);
    //   }
    // });

    // socket.on('userStopTyping', ({ user }) => {
    //   setTypingUsers((prev) =>
    //     prev.filter((prevUser) => prevUser.id !== user.id),
    //   );
    // });

    return () => {
      socket.off('receiveMessage');
      socket.off('userTyping');
      socket.off('userStopTyping');
    };
  }, [chat?.id, socket]);

  const myId = decodeJwt(String(getCookie('token'))).id;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isPendingChat,
    refetch,
  } = useInfiniteChat(chat?.id, 20);

  // Flatten all pages of messages
  const messages = data?.pages.flatMap((page) => page.data.messages) || [];

  // Scroll handler to load more when user reaches top
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // Since it's reversed, the "top" visually = bottom of scroll
    const isAtTop = scrollHeight + scrollTop <= clientHeight + 5; // allow small offset

    if (isAtTop && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      if (socket) {
        socket.emit('typing', { chatId: chat?.id, user: me });
      }
    }

    // Clear previous timeout and set a new one
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (socket) {
        console.log('AAAAx');
        socket.emit('stopTyping', { chatId: chat?.id, user: me });
      }
    }, 1000); // 1s of inactivity
  };

  const activeChat = data?.pages[0].data;

  const otherUser =
    activeChat?.user1?.id === myId ? activeChat?.user2 : activeChat?.user1;
  const me =
    activeChat?.user1?.id === myId ? activeChat?.user1 : activeChat?.user2;
  const isOtherUser1 = activeChat?.user1?.id === myId;

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempId = Date.now();
    const optimisticMessage = {
      id: tempId,
      text: newMessage.trim(),
      sender: { id: myId },
      optimistic: true,
      createdAt: new Date().toISOString(),
      isRead1: isOtherUser1 ? false : true,
      isRead2: isOtherUser1 ? true : false,
    };

    // 1️⃣ Optimistically update local cache for infinite query
    queryClient.setQueryData(['chats', chat?.id], (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page: any, index: number) =>
          index === 0
            ? {
                ...page,
                data: {
                  ...page.data,
                  messages: [optimisticMessage, ...(page.data.messages || [])],
                },
              }
            : page,
        ),
      };
    });

    const messageToSend = newMessage.trim();
    setNewMessage('');

    // 2️⃣ Send to backend
    mutate(
      { id: chat?.id, data: { text: messageToSend } },
      {
        onSuccess: (returnedData) => {
          queryClient.setQueryData(['chats', chat?.id], (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any, index: number) =>
                index === 0
                  ? {
                      ...page,
                      data: {
                        ...page.data,
                        messages: page.data.messages.map((m: any) =>
                          m.id === tempId ? returnedData : m,
                        ),
                      },
                    }
                  : page,
              ),
            };
          });
          if (socket) {
            socket.emit('sendMessage', chat?.id);
            setIsTyping(false);
            socket.emit('stopTyping', { chatId: chat?.id, user: me });
          }
        },
        onError: () => {
          queryClient.setQueryData(['chats', chat?.id], (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any, index: number) =>
                index === 0
                  ? {
                      ...page,
                      data: {
                        ...page.data,
                        messages: page.data.messages.filter(
                          (m: any) => m.id !== tempId,
                        ),
                      },
                    }
                  : page,
              ),
            };
          });
          toast.error(t('chats.errors.send'));
        },
      },
    );
  };

  const { isExpanded } = useMessagesSidebarStore();
  const { mutate, isPending, isError } = useSendMessage();

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth > 768);
    checkScreen(); // run at mount
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const { setExpanded } = useMessagesSidebarStore();

  if (!isDesktop && isExpanded) {
    return null;
  }

  if (!chat) {
    return (
      <p className="text-main-text-helper text-center w-full rounded-level1  bg-second-background flex items-center justify-center">
        {t('chats.text.select')}
      </p>
    );
  }

  return (
    <div
      className={clsx(
        'flex flex-col w-full rounded-level1 overflow-hidden bg-second-background',
        isPendingChat && 'justify-center items-center',
      )}>
      <DataDisplay
        data={data}
        isLoading={isPendingChat}
        refetch={refetch}
        error={isError ? t('chats.errors.load') : undefined}>
        {/* Chat Header */}
        <div className="flex items-center gap-[12px] px-4 py-3 border-b border-main-background bg-second-background/50">
          <button className="flex md:hidden" onClick={() => setExpanded(true)}>
            <ChevronLeft className={isRTL ? 'rotate-180' : ''} />
          </button>

          <div className="rounded-level1 h-[48px] w-[48px] bg-main text-second-background flex justify-center items-center font-bold text-[20px] overflow-hidden">
            {otherUser?.image?.formats ? (
              <img
                src={`${BASE_URL}${otherUser?.image?.formats.thumbnail.url}`}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center ">
                {`${otherUser?.name?.split(' ')[0]?.[0]?.toUpperCase() ?? ''}${
                  otherUser?.name?.split(' ')[1]?.[0]?.toUpperCase() ?? ''
                }`}{' '}
              </div>
            )}
          </div>
          <div>
            <div className="text-lg font-semibold text-main-text">
              {otherUser?.name || 'Unknown User'}
            </div>
            <div className="text-sm text-main-text-hover">
              {Array.isArray(typingUsers) &&
              typingUsers?.some((u) => u.id === otherUser?.id)
                ? t('general.pending.typing')
                : `@${otherUser?.username || 'username'}`}
            </div>
          </div>
          {/* You could add an "options" button here later */}
        </div>

        {/* Messages */}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center">
            <Loading />
          </div>
        )}

        <div
          className="flex-1 overflow-y-auto px-4 py-3  flex flex-col-reverse space-y-reverse space-y-2"
          onScroll={handleScroll}>
          {messages &&
            messages?.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  'flex',
                  msg?.sender?.id === myId ? 'justify-end' : 'justify-start',
                )}>
                <div className="w-[100%] sm:w-[50%]">
                  <div
                    className={`p-2 rounded-level1 ${
                      msg?.sender?.id === myId
                        ? 'bg-main/80 text-white'
                        : 'bg-main/10 text-main'
                    }`}>
                    {msg.text}
                  </div>
                  <p className="text-[12px] text-main-text-helper">
                    {formatDate(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Input */}
        <div className="flex border-t border-main-background bg-second-background/50 px-4 py-3  flex-col gap-[8px]">
          <div className="flex items-stretch gap-[8px]">
            <Input
              multiline={true}
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder={t('chats.text.typePlaceholder')}
              outerClassName="w-full"
              onEnterSubmit={sendMessage}
              autoFocus
            />
            <Button onClick={sendMessage} className="min-w-fit px-[16px]">
              <Send />
            </Button>
          </div>
          {/* <p className="text-[12px] h-[14px]">
            {typingUser && (
              <>
                {typingUser?.name} {t('general.pending.isTyping')}
              </>
            )}
          </p> */}
        </div>
      </DataDisplay>
    </div>
  );
}

