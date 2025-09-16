import api from '../../../lib/axios';

export const markAsRead = (id) => {
  return api
    .put(`/notifications/${id}`, {
      data: {
        isRead: true,
      },
    })
    .then((res) => res.data);
};

export const markAllAsRead = (id) => {
  return api
    .post(`/notifications/mark-all-as-read`, {
      userId: id,
    })
    .then((res) => res.data);
};

export const sendNotification = (payload) => {
  console.log('PAYLOAD IS', payload);
  return api
    .post(`/push-subscriptions/notify-user`, {
      userId: payload.userId,
      title: payload.title,
      message: payload.message,
    })
    .then((res) => res.message);
};

