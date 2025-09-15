import { useMutation } from '@tanstack/react-query';
import { clearPushToken } from '../services/posts';

const useClearPushToken = () => {
  return useMutation({
    mutationFn: () => clearPushToken(),
  });
};

export default useClearPushToken;

