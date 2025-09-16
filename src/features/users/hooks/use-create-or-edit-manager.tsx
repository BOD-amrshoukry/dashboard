import { useMutation } from '@tanstack/react-query';
import { createManager, editManager } from '../services/posts';

const useCreateOrEditManager = () => {
  return useMutation({
    mutationFn: (params: {
      id?: number;
      data: {
        name: string;
        email: string;
        username: string;
        type: string;
      };
    }) => {
      console.log('params', params);
      if (params.id) {
        return editManager(params.id, params.data);
      } else {
        // Create new ticket
        return createManager(params.data);
      }
    },
  });
};

export default useCreateOrEditManager;

