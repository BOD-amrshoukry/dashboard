import { useMutation } from '@tanstack/react-query';
import { deleteEmployee } from '../services/posts';

const useDeleteEmployee = () => {
  return useMutation({
    mutationFn: (id: number) => deleteEmployee(id),
  });
};

export default useDeleteEmployee;

