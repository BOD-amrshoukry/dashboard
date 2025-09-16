import { useQuery } from '@tanstack/react-query';
import { getStats } from '../services/get';

const useGetStats = () => {
  const query = useQuery({
    queryKey: ['stats'],
    staleTime: 0,
    queryFn: () => getStats(),
  });

  return query;
};

export default useGetStats;

