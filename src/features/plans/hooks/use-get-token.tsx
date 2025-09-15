import { useQuery } from '@tanstack/react-query';
import { getToken } from '../services/get';

const useGetToken = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['token'],
    queryFn: () => getToken(),
  });

  return { data, isPending, isError };
};

export default useGetToken;

