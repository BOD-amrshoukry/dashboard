import api from '../../../lib/axios';
import type { FetchParams, FetchResult } from '../../tables/types/table';
import type { Ticket } from '../types/type';

export async function fetchTickets(
  params: FetchParams,
  options?: { userId?: string; unAssigned?: boolean; userType?: string },
): Promise<FetchResult<Ticket>> {
  const query: any = {
    'pagination[page]': params.pageIndex + 1, // Strapi is 1-based
    'pagination[pageSize]': params.pageSize,
    'filters[deletedAt][$null]': true,
    populate: 'user',
  };

  console.log('PARARMSSS', params);
  console.log('optionss', options);

  // Sorting
  if (params.sortBy) {
    query['sort'] = `${params.sortBy.id}:${
      params.sortBy.desc ? 'desc' : 'asc'
    }`;
  }

  // Filtering
  if (params.filters) {
    params.filters.forEach((f) => {
      if (f.value) {
        if (f.id === 'name') {
          query['filters[name][$containsi]'] = f.value;
        }
        if (f.id === 'user.name') {
          query['filters[user][name][$containsi]'] = f.value;
        }
        if (f.id === 'state' && f.value.value) {
          query['filters[state][$eq]'] = f.value.value;
        }
      }
    });
  }

  if (options?.userId) {
    query['filters[user][id][$eq]'] = options?.userId;
  }

  if (options?.unAssigned) {
    query['filters[user][id][$null]'] = true;
  }

  if (options?.userType) {
    query['filters[user][type][$eq]'] = options.userType; // <-- key part
  }

  // Fetch from Strapi
  const res = await api.get('/tickets', { params: query });

  const transformed = {
    data: res.data.data.map((d: any) => ({
      documentId: d.documentId,
      id: d.id,
      name: d.name,
      state: d.state,
      user: d.user
        ? {
            id: d.user.id,
            name: d.user.name,
          }
        : null,
    })),
    total: res.data.meta.pagination.total,
  };

  console.log('transformed', transformed);

  // Transform response
  return transformed;
}

export async function fetchRecycledTickets(
  params: FetchParams,
): Promise<FetchResult<Ticket>> {
  const query: any = {
    'pagination[page]': params.pageIndex + 1, // Strapi is 1-based
    'pagination[pageSize]': params.pageSize,
    'filters[deletedAt][$null]': false,
    populate: 'user',
  };

  // Sorting
  if (params.sortBy) {
    query['sort'] = `${params.sortBy.id}:${
      params.sortBy.desc ? 'desc' : 'asc'
    }`;
  }

  // Filtering
  if (params.filters) {
    params.filters.forEach((f) => {
      if (f.value) {
        if (f.id === 'name') {
          query['filters[name][$containsi]'] = f.value;
        }
        if (f.id === 'user.name') {
          query['filters[user][name][$containsi]'] = f.value;
        }
      }
    });
  }

  // Fetch from Strapi
  const res = await api.get('/tickets', { params: query });

  console.log('dataaa', res);

  const transformed = {
    data: res.data.data.map((d: any) => ({
      documentId: d.documentId,
      id: d.id,
      deletedAt: d.deletedAt,
      name: d.name,
      user: d.user
        ? {
            id: d.user.id,
            name: d.user.name,
          }
        : null,
    })),
    total: res.data.meta.pagination.total,
  };

  console.log('transformed', transformed);

  // Transform response
  return transformed;
}

export const getTicket = async (id: string) => {
  return api
    .get(`/tickets/${id}?populate=user&filters[deletedAt][$null]=true`)
    .then((res) => res.data);
};

export const getRecycledTicket = async (id: string) => {
  return api
    .get(`/tickets/${id}?populate=user&filters[deletedAt][$null]=false`)
    .then((res) => res.data);
};

