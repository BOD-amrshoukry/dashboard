// Define the ticket type (matches your Strapi model)
export type Ticket = {
  id: number;
  name: string;
  state: 'completed' | 'open' | 'pending';
  user: {
    id: number;
    name: string;
  } | null;
};

