import { useMutation } from '@tanstack/react-query';
import { hardDeleteTicket } from '../services/posts';

const useHardDeleteTicket = () => {
  return useMutation({
    mutationFn: (id) => hardDeleteTicket(id),
  });
};

export default useHardDeleteTicket;

