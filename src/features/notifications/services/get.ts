import api from '../../../lib/axios';

export const getNotifications = async (params) => {
  const query = {
    'pagination[page]': params.pageIndex + 1,
    'pagination[pageSize]': params.pageSize,
    'filters[user][id][$eq]': params.userId,
    populate: 'user',
    sort: 'createdAt:desc',
  };

  if (params.sortBy) {
    query['sort'] = `${params.sortBy.id}:${
      params.sortBy.desc ? 'desc' : 'asc'
    }`;
  }

  const res = await api.get('/notifications', { params: query });

  const transformed = {
    data: res.data.data.map((d: any) => ({
      documentId: d.documentId,
      id: d.id,
      isRead: d.isRead,
      head: d.head,
      description: d.description,
      createdAt: d.createdAt,
      user: d.user
        ? {
            id: d.user.id,
            name: d.user.name,
          }
        : null,
    })),
    total: res.data.meta.pagination.total,
  };

  return transformed;
};

export const getNotificationsCounts = async (userId) => {
  const counts = await api.get(`/notifications/counts/${userId}`);
  return counts;
};

