import api from '../../../lib/axios';

export const login = (data) => {
  return api.post('/auth/local', data).then((res) => res.data);
};

export const forgetPassword = (data) => {
  return api.post('/auth/forgot-password', data).then((res) => res.data);
};

export const resetPassword = (data) => {
  return api.post('/auth/reset-password', data).then((res) => res.data);
};

