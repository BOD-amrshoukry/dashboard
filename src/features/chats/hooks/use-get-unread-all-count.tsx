import { useQuery } from '@tanstack/react-query';
import { getUnreadCount } from '../services/get';

const useGetUnreadAllCountChats = () => {
  const query = useQuery({
    queryKey: ['chats', 'count'],
    queryFn: () => getUnreadCount(),
  });

  return query;
};

export default useGetUnreadAllCountChats;

