import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../services/posts';

const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: {
      password: string;
      passwordConfirmation: string;
      code: string;
    }) => resetPassword(data),
  });
};

export default useResetPassword;

