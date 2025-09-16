import type { User } from '../../users/types/type';

export interface Notification {
  id: number;
  documentId: string;
  head: string;
  description: string;
  isRead: boolean;
  user: User;
  createdAt: string;
}

export interface PushSubscription {
  id: number;
  documentId: string;
  endpoint: string;
  keys_p256dh: string;
  keys_auth: string;
  user: User;
}

