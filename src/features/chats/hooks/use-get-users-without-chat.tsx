import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getUsersWithoutChat } from '../services/get';

const useGetUsersWithoutChat = (params) => {
  const query = useQuery({
    queryKey: ['chats', 'users', params.search, params.page],
    queryFn: () => getUsersWithoutChat(params),
    placeholderData: keepPreviousData,
  });

  return query;
};

export default useGetUsersWithoutChat;

