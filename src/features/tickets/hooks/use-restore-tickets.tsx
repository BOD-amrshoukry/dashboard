import { useMutation } from '@tanstack/react-query';
import { restoreTickets } from '../services/posts';

const useRestoreTickets = () => {
  return useMutation({
    mutationFn: (ids) => restoreTickets(ids),
  });
};

export default useRestoreTickets;

