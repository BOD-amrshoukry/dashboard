import { useMutation } from '@tanstack/react-query';
import { markAllChatsAsRead } from '../services/posts';

const useMarkAllChatsAsRead = () => {
  return useMutation({
    mutationFn: () => markAllChatsAsRead(),
  });
};

export default useMarkAllChatsAsRead;

