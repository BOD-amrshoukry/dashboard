import { useMutation } from '@tanstack/react-query';
import { sendMessage } from '../services/posts';

const useSendMessage = () => {
  return useMutation({
    mutationFn: (data) => sendMessage(data.id, data.data),
  });
};

export default useSendMessage;

