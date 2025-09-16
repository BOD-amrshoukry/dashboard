import api from '../../../lib/axios';

interface LoginData {
  identifier: string; // typically email or username
  password: string;
}

interface ForgetPasswordData {
  email: string;
}

interface ResetPasswordData {
  code: string; // usually the reset token
  password: string;
  passwordConfirmation: string;
}

export const login = (data: LoginData) => {
  return api.post('/auth/local', data).then((res) => res.data);
};

export const forgetPassword = (data: ForgetPasswordData) => {
  return api.post('/auth/forgot-password', data).then((res) => res.data);
};

export const resetPassword = (data: ResetPasswordData) => {
  return api.post('/auth/reset-password', data).then((res) => res.data);
};

