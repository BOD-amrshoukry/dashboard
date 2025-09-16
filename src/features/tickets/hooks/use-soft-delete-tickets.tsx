import { useMutation } from '@tanstack/react-query';
import { softDeleteTickets } from '../services/posts';

const useSoftDeleteTickets = () => {
  return useMutation({
    mutationFn: (ids: string[]) => softDeleteTickets(ids),
  });
};

export default useSoftDeleteTickets;

