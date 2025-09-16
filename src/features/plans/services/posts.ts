import api from '../../../lib/axios';

export const pay = (data: { nonce: any; amount: number; planId: number }) => {
  return api.post('/plans/braintree/checkout', data).then((res) => res.data);
};

