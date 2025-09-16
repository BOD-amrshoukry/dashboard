import { useQuery } from '@tanstack/react-query';
import { getRecycledTicket } from '../services/get';

const useGetRecycledTicket = (id: string) => {
  const query = useQuery({
    queryKey: ['recycle', id],
    queryFn: () => getRecycledTicket(id),
  });

  return query;
};

export default useGetRecycledTicket;

