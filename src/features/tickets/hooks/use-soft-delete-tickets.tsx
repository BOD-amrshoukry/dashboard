import { useMutation } from '@tanstack/react-query';
import { softDeleteTickets } from '../services/posts';

const useSoftDeleteTickets = () => {
  return useMutation({
    mutationFn: (ids) => softDeleteTickets(ids),
  });
};

export default useSoftDeleteTickets;

