import { useMutation } from '@tanstack/react-query';
import { assignTickets } from '../services/posts';

const useAssignTickets = () => {
  return useMutation({
    mutationFn: ({ ids, userId }) => assignTickets(ids, userId),
  });
};

export default useAssignTickets;

