import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserChat } from '../services/get';

const useInfiniteChat = (id: number | undefined, pageSize: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['chats', id],
    enabled: !!id,
    queryFn: ({ pageParam = 1 }) =>
      id
        ? getUserChat(id, { page: pageParam, pageSize })
        : Promise.resolve({ data: [], meta: { page: 0, pageCount: 0 } }),
    getNextPageParam: (lastPage) => {
      // lastPage.meta has pagination info from backend
      const { page, pageCount } = lastPage.meta;
      return page < pageCount ? page + 1 : undefined; // stop when no more pages
    },
    initialPageParam: 1,
  });
};

export default useInfiniteChat;

