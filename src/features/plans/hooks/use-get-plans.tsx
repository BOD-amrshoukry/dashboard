import { useQuery } from '@tanstack/react-query';
import { getPlans } from '../services/get';

const useGetPlans = (locale: string) => {
  const query = useQuery({
    queryKey: ['plans'],
    queryFn: () => getPlans(locale),
  });

  return query;
};

export default useGetPlans;

