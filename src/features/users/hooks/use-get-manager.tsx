import { useQuery } from '@tanstack/react-query';
import { getManager } from '../services/get';

const useGetManager = (id: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['managers', id],
    queryFn: () => getManager(id),
  });

  return { data, isPending, isError };
};

export default useGetManager;

