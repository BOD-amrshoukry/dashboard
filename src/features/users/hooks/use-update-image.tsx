import { useMutation } from '@tanstack/react-query';
import { updateUserImage } from '../services/posts';

const useUpdateImage = () => {
  return useMutation({
    mutationFn: (params: { id: number; file: File }) =>
      updateUserImage(params.id, params.file),
  });
};

export default useUpdateImage;

