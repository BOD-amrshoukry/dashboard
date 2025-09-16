import { useMutation } from '@tanstack/react-query';
import { unassignTickets } from '../services/posts';

const useUnassignTickets = () => {
  return useMutation({
    mutationFn: (ids: string[]) => unassignTickets(ids),
  });
};

export default useUnassignTickets;

