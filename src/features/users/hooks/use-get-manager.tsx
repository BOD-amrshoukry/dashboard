import { useQuery } from '@tanstack/react-query';
import { getManager } from '../services/get';

const useGetManager = (id: number) => {
  const query = useQuery({
    queryKey: ['managers', id],
    queryFn: () => getManager(id),
  });

  return query;
};

export default useGetManager;

