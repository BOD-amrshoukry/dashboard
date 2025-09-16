import api from '../../../lib/axios';

export const getUsersWithoutChat = async (params) => {
  return api
    .get(`/chats/users-without-chat`, {
      params: { search: params.search, page: params.page, limit: 10 },
    })
    .then((res) => res.data);
};

export const getUserChats = async (params) => {
  return api
    .get(`/chats/user-chats`, {
      params: { search: params.search, page: params.page, limit: 10 },
    })
    .then((res) => res.data);
};

export const getUserChat = async (id, params) => {
  return api
    .get(`/chats/${id}`, {
      params: { page: params.page, limit: 10 },
    })
    .then((res) => res.data);
};

export const getUnreadCount = async () => {
  return api.get(`/chats/unread-count`).then((res) => res.data);
};

export const getAllUserChats = async () => {
  return api.get(`/chats/all`).then((res) => res.data);
};

