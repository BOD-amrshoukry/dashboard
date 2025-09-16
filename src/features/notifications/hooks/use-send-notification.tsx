import { useMutation } from '@tanstack/react-query';
import { sendNotification } from '../services/posts';

interface NotificationPayload {
  userId: number;
  title: string;
  message: string;
}

const useSendNotification = () => {
  return useMutation({
    mutationFn: (payload: NotificationPayload) => sendNotification(payload),
  });
};

export default useSendNotification;

