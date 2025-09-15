import { useMutation } from '@tanstack/react-query';
import { hardDeleteTickets } from '../services/posts';

const useHardDeleteTickets = () => {
  return useMutation({
    mutationFn: (ids) => hardDeleteTickets(ids),
  });
};

export default useHardDeleteTickets;

