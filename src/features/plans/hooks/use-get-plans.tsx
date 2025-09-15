import { useQuery } from '@tanstack/react-query';
import { getPlans } from '../services/get';

const useGetPlans = (locale: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['plans'],
    queryFn: () => getPlans(locale),
  });

  return { data, isPending, isError };
};

export default useGetPlans;

