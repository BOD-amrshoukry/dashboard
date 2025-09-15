import { useMutation } from '@tanstack/react-query';
import { updateUserImage } from '../services/posts';

const useUpdateImage = () => {
  return useMutation({
    mutationFn: (params) => updateUserImage(params.id, params.file),
  });
};

export default useUpdateImage;

