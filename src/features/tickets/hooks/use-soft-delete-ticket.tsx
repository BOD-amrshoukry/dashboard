import { useMutation } from '@tanstack/react-query';
import { softDeleteTicket } from '../services/posts';

const useSoftDeleteTicket = () => {
  return useMutation({
    mutationFn: (id) => softDeleteTicket(id),
  });
};

export default useSoftDeleteTicket;

