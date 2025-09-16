import { useQuery } from '@tanstack/react-query';
import { getManager } from '../services/get';

const useGetManager = (id: string) => {
  const query = useQuery({
    queryKey: ['managers', id],
    queryFn: () => getManager(id),
  });

  return query;
};

export default useGetManager;

