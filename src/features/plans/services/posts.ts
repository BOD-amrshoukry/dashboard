import api from '../../../lib/axios';

export const pay = (data) => {
  return api.post('/plans/braintree/checkout', data).then((res) => res.data);
};

