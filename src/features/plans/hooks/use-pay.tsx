import { useMutation } from '@tanstack/react-query';
import { pay } from '../services/posts';

const usePay = () => {
  return useMutation({
    mutationFn: (data) => pay(data),
  });
};

export default usePay;

