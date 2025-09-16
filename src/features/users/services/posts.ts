import api from '../../../lib/axios';
import { generateRandomPassword } from '../../../shared/utils/auth';

export const deleteManager = (id: number) => {
  return api.delete(`/users/${id}`).then((res) => res.data);
};

export const deleteEmployee = (id: number) => {
  return api.delete(`/users/${id}`).then((res) => res.data);
};

export const deleteManagers = (ids: number[]) => {
  return api
    .post(`/users/delete-many`, {
      userIds: ids,
    })
    .then((res) => res.data);
};

export const deleteEmployees = (ids: number[]) => {
  return api
    .post(`/users/delete-many`, {
      userIds: ids,
    })
    .then((res) => res.data);
};

export const createEmployee = (data: {
  name: string;
  username: string;
  email: string;
  type: string;
}) => {
  return api
    .post('/auth/local/register', {
      name: data?.name,
      username: data?.username,
      email: data?.email,
      password: generateRandomPassword(10),
      type: 'employee',
    })
    .then((res) => res.data);
};

export const createManager = (data: {
  name: string;
  username: string;
  email: string;
  type: string;
}) => {
  return api
    .post('/auth/local/register', {
      name: data?.name,
      username: data?.username,
      email: data?.email,
      password: generateRandomPassword(10),
      type: 'manager',
    })
    .then((res) => res.data);
};

export const editEmployee = (
  id: number,
  data: {
    name: string;
  },
) => {
  return api.put(`/users/${id}`, data).then((res) => res.data);
};

export const editManager = (
  id: number,
  data: {
    name: string;
  },
) => {
  return api.put(`/users/${id}`, data).then((res) => res.data);
};

export const updateUserImage = async (id: number, file: File) => {
  // Step 1: prepare formData
  const formData = new FormData();
  formData.append('files', file);

  // Step 2: upload the file
  const uploadRes = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const uploadedFile = uploadRes.data[0]; // Strapi returns an array
  const fileId = uploadedFile.id;

  // Step 3: update the user with new avatar/image

  const updateRes = await api.put(`/users/${id}`, {
    image: fileId, // assumes you added an 'avatar' relation to User
  });

  return updateRes.data;
};

export const deleteUserImage = (id: number) => {
  return api.put(`/users/${id}`, { image: null }).then((res) => res.data);
};

