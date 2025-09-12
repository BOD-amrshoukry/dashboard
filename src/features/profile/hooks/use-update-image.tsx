import { useMutation } from '@tanstack/react-query';
import { updateImage } from '../services/posts';

const useUpdateImage = () => {
  return useMutation({
    mutationFn: (data: File) => updateImage(data),
  });
};

export default useUpdateImage;

