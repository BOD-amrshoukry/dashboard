import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getNotifications } from '../services/get';

const useGetNotifications = (params) => {
  const query = useQuery({
    queryKey: ['notifications', params.userId, params.pageIndex],
    queryFn: () => getNotifications(params),
    placeholderData: keepPreviousData,
  });

  return query;
};

export default useGetNotifications;

