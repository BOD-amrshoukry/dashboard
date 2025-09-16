import api from '../../../lib/axios';

export const sendMessage = (id, data) => {
  return api.post(`/chats/${id}/messages`, data).then((res) => res.data);
};

export const startChat = (data) => {
  return api.post(`/chats/create`, data).then((res) => res.data);
};

export const markChatAsRead = (id) => {
  return api.post(`/chats/mark-read/${id}`).then((res) => res.data);
};

export const markAllChatsAsRead = () => {
  return api.post(`/chats/mark-all-as-read/`).then((res) => res.data);
};

