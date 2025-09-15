import { useMutation } from '@tanstack/react-query';
import { createEmployee, editEmployee } from '../services/posts';

const useCreateOrEditEmployee = () => {
  return useMutation({
    mutationFn: (params) => {
      console.log('params', params);
      if (params.id) {
        return editEmployee(params.id, params.data);
      } else {
        // Create new ticket
        return createEmployee(params.data);
      }
    },
  });
};

export default useCreateOrEditEmployee;

