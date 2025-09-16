import api from '../../../lib/axios';

export const getPlans = async (locale: string) => {
  return api
    .get(`/plans?locale=${locale}&sort=planId:asc`)
    .then((res) => res.data);
};

export const getToken = async () => {
  return api.get(`/plans/braintree/client-token`).then((res) => res.data);
};

