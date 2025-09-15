import { useQuery } from '@tanstack/react-query';
import { getEmployeeStats } from '../services/get';

const useGetEmployeeStats = (id: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['employeeStats'],
    staleTime: 0,
    queryFn: () => getEmployeeStats(id),
  });

  return { data, isPending, isError };
};

export default useGetEmployeeStats;

