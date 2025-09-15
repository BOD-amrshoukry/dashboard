import { useMutation } from '@tanstack/react-query';
import { unassignTickets } from '../services/posts';

const useUnassignTickets = () => {
  return useMutation({
    mutationFn: (ids) => unassignTickets(ids),
  });
};

export default useUnassignTickets;

