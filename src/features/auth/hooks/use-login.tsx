import { useMutation } from '@tanstack/react-query';
import { login } from '../services/posts';

const useLogin = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => login(data),
  });
};

export default useLogin;

