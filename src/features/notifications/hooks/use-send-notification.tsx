import { useMutation } from '@tanstack/react-query';
import { sendNotification } from '../services/posts';

const useSendNotification = () => {
  return useMutation({
    mutationFn: (payload) => sendNotification(payload),
  });
};

export default useSendNotification;

