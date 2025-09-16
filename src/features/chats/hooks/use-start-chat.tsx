import { useMutation } from '@tanstack/react-query';
import { startChat } from '../services/posts';

const useStartChat = () => {
  return useMutation({
    mutationFn: (data: { userId: number; message: string }) => startChat(data),
  });
};

export default useStartChat;

