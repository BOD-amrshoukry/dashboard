import { useMutation } from '@tanstack/react-query';
import { deleteManager } from '../services/posts';

const useDeleteManager = () => {
  return useMutation({
    mutationFn: (id: number) => deleteManager(id),
  });
};

export default useDeleteManager;

