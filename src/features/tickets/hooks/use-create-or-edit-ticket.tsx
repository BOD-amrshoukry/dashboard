import { useMutation } from '@tanstack/react-query';
import { createTicket, updateTicket } from '../services/posts';

type TicketInput = {
  title: string;
  description: string;
  userId: number;
};

const useCreateOrUpdateTicket = () => {
  return useMutation({
    mutationFn: (params: { id?: string; data: TicketInput }) => {
      console.log('params', params);
      if (params.id) {
        return updateTicket(params.id, params.data);
      } else {
        // Create new ticket
        return createTicket(params.data);
      }
    },
  });
};

export default useCreateOrUpdateTicket;

