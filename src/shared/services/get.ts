import api from '../../lib/axios';

export const getMe = () => {
  return api.get('/users/me?populate=image').then((res) => res.data);
};

