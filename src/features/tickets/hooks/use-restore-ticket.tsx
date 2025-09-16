import { useMutation } from '@tanstack/react-query';
import { restoreTicket } from '../services/posts';

const useRestoreTicket = () => {
  return useMutation({
    mutationFn: (id: string) => restoreTicket(id),
  });
};

export default useRestoreTicket;

