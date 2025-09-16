import { useQuery } from '@tanstack/react-query';
import { getTicket } from '../services/get';

const useGetTicket = (id: string) => {
  const query = useQuery({
    queryKey: ['tickets', id],
    queryFn: () => getTicket(id),
  });

  return query;
};

export default useGetTicket;

