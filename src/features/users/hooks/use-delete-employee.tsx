import { useMutation } from '@tanstack/react-query';
import { deleteEmployee } from '../services/posts';

const useDeleteEmployee = () => {
  return useMutation({
    mutationFn: (id) => deleteEmployee(id),
  });
};

export default useDeleteEmployee;

