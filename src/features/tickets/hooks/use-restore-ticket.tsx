import { useMutation } from '@tanstack/react-query';
import { restoreTicket } from '../services/posts';

const useRestoreTicket = () => {
  return useMutation({
    mutationFn: (id) => restoreTicket(id),
  });
};

export default useRestoreTicket;

