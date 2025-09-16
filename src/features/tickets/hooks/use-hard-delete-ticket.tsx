import { useMutation } from '@tanstack/react-query';
import { hardDeleteTicket } from '../services/posts';

const useHardDeleteTicket = () => {
  return useMutation({
    mutationFn: (id: string) => hardDeleteTicket(id),
  });
};

export default useHardDeleteTicket;

