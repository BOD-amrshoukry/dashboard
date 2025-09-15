import { useMutation } from '@tanstack/react-query';
import { markAllAsRead } from '../services/posts';

const useMarkAllAsRead = () => {
  return useMutation({
    mutationFn: (id) => markAllAsRead(id),
  });
};

export default useMarkAllAsRead;

