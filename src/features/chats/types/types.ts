import type { User } from '../../users/types/type';

export interface Chat {
  documentId: string;
  id: number;
  user1: User;
  user2: User;
  messages: Message[];
  unreadCount?: number;
}

export interface Message {
  documentId: string;
  id: number;
  chat: Chat;
  sender: User;
  text: string;
  isRead1: boolean;
  isRead2: boolean;
}

