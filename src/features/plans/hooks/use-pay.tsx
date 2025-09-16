import { useMutation } from '@tanstack/react-query';
import { pay } from '../services/posts';

const usePay = () => {
  return useMutation({
    mutationFn: (data: { nonce: any; amount: number; planId: number }) =>
      pay(data),
  });
};

export default usePay;

