import { useMutation } from '@tanstack/react-query';
import { deleteImage } from '../services/posts';

const useDeleteImage = () => {
  return useMutation({
    mutationFn: (id: number) => deleteImage(id),
  });
};

export default useDeleteImage;

