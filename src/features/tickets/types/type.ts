import type { User } from '../../users/types/type';

// Define the ticket type (matches your Strapi model)
export type Ticket = {
  documentId: string;
  id: number;
  name: string;
  state: 'completed' | 'open' | 'pending';
  user?: User;
  deletedAt: string;
};

