import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getNotifications } from '../services/get';

const useGetNotifications = (params) => {
  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ['notifications', params.userId, params.pageIndex],
    queryFn: () => getNotifications(params),
    placeholderData: keepPreviousData,
  });

  return { data, isPending, isError, isFetching };
};

export default useGetNotifications;

