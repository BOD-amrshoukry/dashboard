import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getNotifications } from '../services/get';

const useGetNotifications = (params: {
  userId: number;
  pageIndex: number;
  pageSize: number;
  sortBy?: { id: string; desc: boolean };
}) => {
  const query = useQuery({
    queryKey: ['notifications', params.userId, params.pageIndex],
    queryFn: () => getNotifications(params),
    placeholderData: keepPreviousData,
  });

  return query;
};

export default useGetNotifications;

