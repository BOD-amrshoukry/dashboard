import api from '../../../lib/axios';

export const createTicket = (data: {
  name: string;
  state: string;
  user: number;
}) => {
  return api.post('/tickets', { data }).then((res) => res.data);
};

export const updateTicket = (
  id: string,
  data: {
    name: string;
    state: string;
    user: number;
  },
) => {
  return api.put(`/tickets/${id}`, { data }).then((res) => res.data);
};

export const softDeleteTicket = (id: string) => {
  return api
    .put(`/tickets/${id}`, {
      data: {
        deletedAt: new Date().toISOString(),
      },
    })
    .then((res) => res.data);
};

export const restoreTicket = (id: string) => {
  return api
    .put(`/tickets/${id}`, {
      data: {
        deletedAt: null,
      },
    })
    .then((res) => res.data);
};

export const hardDeleteTicket = (id: string) => {
  return api.delete(`/tickets/${id}`).then((res) => res.data);
};

export const softDeleteTickets = (ids: string[]) => {
  return api
    .post(`/tickets/soft-delete-many`, {
      documentIds: ids,
    })
    .then((res) => res.data);
};

export const restoreTickets = (ids: string[]) => {
  return api
    .post(`/tickets/restore-many`, {
      documentIds: ids,
    })
    .then((res) => res.data);
};

export const hardDeleteTickets = (ids: string[]) => {
  return api
    .post(`/tickets/hard-delete-many`, {
      documentIds: ids,
    })
    .then((res) => res.data);
};

export const unassignTicket = (id: string) => {
  return api
    .put(`/tickets/${id}`, {
      data: {
        user: null,
      },
    })
    .then((res) => res.data);
};

export const unassignTickets = (ids: string[]) => {
  return api
    .post(`/tickets/unassign-many`, {
      documentIds: ids,
    })
    .then((res) => res.data);
};

export const assignTickets = (ids: string[], userId: number) => {
  return api
    .post(`/tickets/assign-many`, {
      documentIds: ids,
      userId: userId,
    })
    .then((res) => res.data);
};

