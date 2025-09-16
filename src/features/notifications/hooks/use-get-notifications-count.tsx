import { useQuery } from '@tanstack/react-query';
import { getNotificationsCounts } from '../services/get';

const useGetNotificationsCount = (userId: number) => {
  const query = useQuery({
    queryKey: ['notifications', 'count', userId],
    queryFn: () => getNotificationsCounts(userId),
  });

  return query;
};

export default useGetNotificationsCount;

