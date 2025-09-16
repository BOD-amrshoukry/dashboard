import { useMutation } from '@tanstack/react-query';
import { editUser } from '../services/posts';

const useEditUser = () => {
  return useMutation({
    mutationFn: (data: { name: string }) => editUser(data),
  });
};

export default useEditUser;

