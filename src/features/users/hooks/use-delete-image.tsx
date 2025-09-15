import { useMutation } from '@tanstack/react-query';
import { deleteUserImage } from '../services/posts';

const useDeleteImage = () => {
  return useMutation({
    mutationFn: (id) => deleteUserImage(id),
  });
};

export default useDeleteImage;

