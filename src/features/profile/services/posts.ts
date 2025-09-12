import api from '../../../lib/axios';
import { decodeJwt, getCookie } from '../../../shared/utils/auth';

export const updateImage = async (file: File) => {
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

  const myId = decodeJwt(String(getCookie('token'))).id;

  const updateRes = await api.put(`/users/${myId}`, {
    image: fileId, // assumes you added an 'avatar' relation to User
  });

  return updateRes.data;
};

export const deleteImage = () => {
  const myId = decodeJwt(String(getCookie('token'))).id;

  return api.put(`/users/${myId}`, { image: null }).then((res) => res.data);
};

export const editUser = (data) => {
  const myId = decodeJwt(String(getCookie('token'))).id;

  return api.put(`/users/${myId}`, data).then((res) => res.data);
};

