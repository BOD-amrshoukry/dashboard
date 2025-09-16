import { useMutation } from '@tanstack/react-query';
import { assignTickets } from '../services/posts';

const useAssignTickets = () => {
  return useMutation({
    mutationFn: ({ ids, userId }: { ids: string[]; userId: number }) =>
      assignTickets(ids, userId),
  });
};

export default useAssignTickets;

