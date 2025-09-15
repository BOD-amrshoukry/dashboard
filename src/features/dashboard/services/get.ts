import api from '../../../lib/axios';

export const getStats = async () => {
  return api.get(`/dashboard/stats`).then((res) => res.data);
};

