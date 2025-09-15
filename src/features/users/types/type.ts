export type User = {
  id: number;
  name: string;
  state: 'completed' | 'open' | 'pending';
  user: {
    id: number;
    name: string;
  } | null;
  type: 'manager' | 'employee';
};

