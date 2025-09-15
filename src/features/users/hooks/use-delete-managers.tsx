import { useMutation } from '@tanstack/react-query';
import { deleteManagers } from '../services/posts';

const useDeleteManagers = () => {
  return useMutation({
    mutationFn: (ids) => deleteManagers(ids),
  });
};

export default useDeleteManagers;

