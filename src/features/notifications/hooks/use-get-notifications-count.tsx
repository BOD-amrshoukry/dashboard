import { useQuery } from '@tanstack/react-query';
import { getNotificationsCounts } from '../services/get';

const useGetNotificationsCount = (userId) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['notifications', 'count', userId],
    queryFn: () => getNotificationsCounts(userId),
  });

  return { data, isPending, isError };
};

export default useGetNotificationsCount;

