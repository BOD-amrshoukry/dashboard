import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserChat } from '../services/get';

const useInfiniteChat = (id: number, pageSize = 20) => {
  return useInfiniteQuery({
    queryKey: ['chats', id],
    enabled: !!id,
    queryFn: ({ pageParam = 1 }) =>
      getUserChat(id, { page: pageParam, pageSize }),
    getNextPageParam: (lastPage, allPages) => {
      // lastPage.meta has pagination info from backend
      const { page, pageCount } = lastPage.meta;
      return page < pageCount ? page + 1 : undefined; // stop when no more pages
    },
  });
};

export default useInfiniteChat;

