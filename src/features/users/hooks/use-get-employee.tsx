import { useQuery } from '@tanstack/react-query';
import { getEmployee } from '../services/get';

const useGetEmployee = (id: number) => {
  const query = useQuery({
    queryKey: ['employees', id],
    queryFn: () => getEmployee(id),
  });

  return query;
};

export default useGetEmployee;

