import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getUserChats } from '../services/get';

const useGetUserChats = (params: { search: string; page: number }) => {
  const query = useQuery({
    queryKey: ['chats', params.search, params.page],
    queryFn: () => getUserChats(params),
    placeholderData: keepPreviousData,
  });

  return query;
};

export default useGetUserChats;

