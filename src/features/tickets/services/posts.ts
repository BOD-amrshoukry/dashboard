import api from '../../../lib/axios';

export const createTicket = (data) => {
  return api.post('/tickets', { data }).then((res) => res.data);
};

export const updateTicket = (id, data) => {
  return api.put(`/tickets/${id}`, { data }).then((res) => res.data);
};

export const softDeleteTicket = (id) => {
  return api
    .put(`/tickets/${id}`, {
      data: {
        deletedAt: new Date().toISOString(),
      },
    })
    .then((res) => res.data);
};

export const restoreTicket = (id) => {
  return api
    .put(`/tickets/${id}`, {
      data: {
        deletedAt: null,
      },
    })
    .then((res) => res.data);
};

export const hardDeleteTicket = (id) => {
  return api.delete(`/tickets/${id}`).then((res) => res.data);
};

export const softDeleteTickets = (ids) => {
  return api
    .post(`/tickets/soft-delete-many`, {
      documentIds: ids,
    })
    .then((res) => res.data);
};

export const restoreTickets = (ids) => {
  return api
    .post(`/tickets/restore-many`, {
      documentIds: ids,
    })
    .then((res) => res.data);
};

export const hardDeleteTickets = (ids) => {
  return api
    .post(`/tickets/hard-delete-many`, {
      documentIds: ids,
    })
    .then((res) => res.data);
};

export const unassignTicket = (id) => {
  return api
    .put(`/tickets/${id}`, {
      data: {
        user: null,
      },
    })
    .then((res) => res.data);
};

export const unassignTickets = (ids) => {
  return api
    .post(`/tickets/unassign-many`, {
      documentIds: ids,
    })
    .then((res) => res.data);
};

export const assignTickets = (ids, userId) => {
  return api
    .post(`/tickets/assign-many`, {
      documentIds: ids,
      userId: userId,
    })
    .then((res) => res.data);
};

