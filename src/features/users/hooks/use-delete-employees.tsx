import { useMutation } from '@tanstack/react-query';
import { deleteEmployees } from '../services/posts';

const useDeleteEmployees = () => {
  return useMutation({
    mutationFn: (ids: number[]) => deleteEmployees(ids),
  });
};

export default useDeleteEmployees;

