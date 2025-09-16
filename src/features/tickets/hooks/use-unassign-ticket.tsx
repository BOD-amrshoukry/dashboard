import { useMutation } from '@tanstack/react-query';
import { unassignTicket } from '../services/posts';

const useUnassignTicket = () => {
  return useMutation({
    mutationFn: (id: string) => unassignTicket(id),
  });
};

export default useUnassignTicket;

