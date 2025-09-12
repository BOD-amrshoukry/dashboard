import api from '../../lib/axios';

export const getMe = () => {
  return api.get('/users/me').then((res) => res.data);
};

