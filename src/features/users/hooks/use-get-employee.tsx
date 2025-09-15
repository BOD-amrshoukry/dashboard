import { useQuery } from '@tanstack/react-query';
import { getEmployee } from '../services/get';

const useGetEmployee = (id: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['employees', id],
    queryFn: () => getEmployee(id),
  });

  return { data, isPending, isError };
};

export default useGetEmployee;

