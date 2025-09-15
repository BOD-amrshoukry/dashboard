import { useMutation } from '@tanstack/react-query';
import { markAsRead } from '../services/posts';

const useMarkAsRead = () => {
  return useMutation({
    mutationFn: (id) => markAsRead(id),
  });
};

export default useMarkAsRead;

