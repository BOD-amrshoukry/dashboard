import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllUserChats } from '../services/get';

const useGetAllUserChats = () => {
  const query = useQuery({
    queryKey: ['chats', 'me'],
    queryFn: () => getAllUserChats(),
    placeholderData: keepPreviousData,
  });

  return query;
};

export default useGetAllUserChats;

