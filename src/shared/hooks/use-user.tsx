import { useQuery } from '@tanstack/react-query';
import { getMe } from '../services/get';

const useUser = () => {
  const query = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(),
  });

  return query;
};

export default useUser;

