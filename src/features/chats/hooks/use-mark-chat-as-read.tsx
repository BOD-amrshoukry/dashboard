import { useMutation } from '@tanstack/react-query';
import { markChatAsRead } from '../services/posts';

const useMarkChatAsRead = () => {
  return useMutation({
    mutationFn: (id) => markChatAsRead(id),
  });
};

export default useMarkChatAsRead;

