import api from '../../../lib/axios';

export const sendMessage = (id: number, data: { text: string }) => {
  return api.post(`/chats/${id}/messages`, data).then((res) => res.data);
};

export const startChat = (data: { userId: number; message: string }) => {
  return api.post(`/chats/create`, data).then((res) => res.data);
};

export const markChatAsRead = (id: number) => {
  return api.post(`/chats/mark-read/${id}`).then((res) => res.data);
};

export const markAllChatsAsRead = () => {
  return api.post(`/chats/mark-all-as-read/`).then((res) => res.data);
};

