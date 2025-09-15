import { useQuery } from '@tanstack/react-query';
import { getStats } from '../services/get';

const useGetStats = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['stats'],
    staleTime: 0,
    queryFn: () => getStats(),
  });

  return { data, isPending, isError };
};

export default useGetStats;

