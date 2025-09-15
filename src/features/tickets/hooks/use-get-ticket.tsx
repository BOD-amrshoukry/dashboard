import { useQuery } from '@tanstack/react-query';
import { getTicket } from '../services/get';

const useGetTicket = (id: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['tickets', id],
    queryFn: () => getTicket(id),
  });

  return { data, isPending, isError };
};

export default useGetTicket;

