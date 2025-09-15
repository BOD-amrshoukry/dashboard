import { useMutation } from '@tanstack/react-query';
import { deleteManager } from '../services/posts';

const useDeleteManager = () => {
  return useMutation({
    mutationFn: (id) => deleteManager(id),
  });
};

export default useDeleteManager;

