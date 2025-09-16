import { useMutation } from '@tanstack/react-query';
import { startChat } from '../services/posts';

const useStartChat = () => {
  return useMutation({
    mutationFn: (data) => startChat(data),
  });
};

export default useStartChat;

