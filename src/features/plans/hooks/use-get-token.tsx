import { useQuery } from '@tanstack/react-query';
import { getToken } from '../services/get';

const useGetToken = () => {
  const query = useQuery({
    queryKey: ['token'],
    queryFn: () => getToken(),
  });

  return query;
};

export default useGetToken;

