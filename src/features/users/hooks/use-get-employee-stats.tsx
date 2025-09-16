import { useQuery } from '@tanstack/react-query';
import { getEmployeeStats } from '../services/get';

const useGetEmployeeStats = (id: string) => {
  const query = useQuery({
    queryKey: ['employeeStats'],
    staleTime: 0,
    queryFn: () => getEmployeeStats(id),
  });

  return query;
};

export default useGetEmployeeStats;

