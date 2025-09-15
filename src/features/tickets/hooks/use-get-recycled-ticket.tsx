import { useQuery } from '@tanstack/react-query';
import { getRecycledTicket } from '../services/get';

const useGetRecycledTicket = (id: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['recycle', id],
    queryFn: () => getRecycledTicket(id),
  });

  return { data, isPending, isError };
};

export default useGetRecycledTicket;

