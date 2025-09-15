import { useMutation } from '@tanstack/react-query';
import { updateImage } from '../services/posts';

const useUpdateImage = () => {
  return useMutation({
    mutationFn: (params) => updateImage(params.id, params.file),
  });
};

export default useUpdateImage;

