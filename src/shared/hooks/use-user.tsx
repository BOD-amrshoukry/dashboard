import { useQuery } from '@tanstack/react-query';
import { getMe } from '../services/get';

const useUser = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(),
  });

  return { data, isLoading, isError };
};

export default useUser();
