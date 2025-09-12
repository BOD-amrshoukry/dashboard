import { useMutation } from '@tanstack/react-query';
import { forgetPassword } from '../services/posts';

const useForgetPassword = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => forgetPassword(data),
  });
};

export default useForgetPassword;

