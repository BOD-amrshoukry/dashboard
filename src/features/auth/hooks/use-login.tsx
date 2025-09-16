import { useMutation } from '@tanstack/react-query';
import { login } from '../services/posts';

const useLogin = () => {
  return useMutation({
    mutationFn: (data: { identifier: string; password: string }) => login(data),
  });
};

export default useLogin;

