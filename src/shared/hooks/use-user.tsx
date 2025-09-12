import { useQuery } from '@tanstack/react-query';
import { getMe } from '../services/get';

const useUser = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(),
  });

  return { data, isPending, isError };
};

export default useUser;

