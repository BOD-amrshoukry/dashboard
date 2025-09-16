import type { Chat, Message } from '../../chats/types/types';
import type { PushSubscription } from '../../notifications/types/types';
import type { Ticket } from '../../tickets/types/type';

export type User = {
  id: number;
  username: string;
  email: string;
  name: string;
  type: 'manager' | 'employee' | 'owner';
  chatId?: string;
  push_subscriptions?: PushSubscription[];
  tickets?: Ticket[];
  notifications?: Notification[];
  messages?: Message[];
  chats1?: Chat;
  chats2?: Chat;
  image?: {
    formats: {
      thumbnail: {
        url: string;
      };
    };
  };
};

