import api from '../../../lib/axios';
import type { FetchParams, FetchResult } from '../../../shared/types/table';
import type { User } from '../types/type';

export async function getEmployees(
  params: FetchParams,
): Promise<FetchResult<User>> {
  const page = params.pageIndex + 1; // Strapi is 1-based
  const pageSize = params.pageSize;

  // Build query params (Users plugin still legacy in v5)
  const query: any = {
    start: (page - 1) * pageSize,
    limit: pageSize,
    'filters[type][$eq]': 'employee',
    populate: 'image',
  };

  // Sorting
  if (params.sortBy) {
    query.sort = `${params.sortBy.id}:${params.sortBy.desc ? 'desc' : 'asc'}`;
  }

  // Filtering
  if (params.filters) {
    params.filters.forEach((f) => {
      if (f.value) {
        if (f.id === 'username') {
          query['filters[username][$containsi]'] = f.value;
        }
        if (f.id === 'email') {
          query['filters[email][$containsi]'] = f.value;
        }
        if (f.id === 'name') {
          query['filters[name][$containsi]'] = f.value;
        }
      }
    });
  }

  // Fetch from Strapi Users endpoint
  const res = await api.get('/users', { params: query });

  // total still comes from Content-Range or fallback
  const countRes = await api.get('/users', {
    params: { ...query, start: 0, limit: 0 },
  });

  const total = countRes.data.length;

  return {
    data: res.data.map((d: any) => ({
      id: d.id,
      username: d.username,
      email: d.email,
      image: d.image,
      name: d.name ?? null,
    })),
    total,
  };
}

export async function getManagers(
  params: FetchParams,
): Promise<FetchResult<User>> {
  const page = params.pageIndex + 1; // Strapi is 1-based
  const pageSize = params.pageSize;

  // Build query params (Strapi v5 style)
  const query: any = {
    pagination: {
      page,
      pageSize,
      withCount: true, // ensures Content-Range header is sent
    },
    filters: {
      type: { $eq: 'manager' },
    },
    populate: ['image'],
  };

  // Sorting
  if (params.sortBy) {
    query.sort = [`${params.sortBy.id}:${params.sortBy.desc ? 'desc' : 'asc'}`];
  }

  // Filtering by username, email, or name
  if (params.filters) {
    params.filters.forEach((f) => {
      if (f.value) {
        if (f.id === 'username') {
          query.filters.username = { $containsi: f.value };
        }
        if (f.id === 'email') {
          query.filters.email = { $containsi: f.value };
        }
        if (f.id === 'name') {
          query.filters.name = { $containsi: f.value };
        }
      }
    });
  }

  // Fetch from Strapi Users endpoint
  const res = await api.get('/users', { params: query });

  // Users plugin still returns raw array, not wrapped { data, meta }
  const users = res.data;

  // total still comes from Content-Range or fallback
  const countRes = await api.get('/users', {
    params: { ...query, start: 0, limit: 0 },
  });

  const total = countRes.data.length;

  return {
    data: users.map((d: any) => ({
      id: d.id,
      username: d.username,
      email: d.email,
      image: d.image,
      name: d.name ?? null,
    })),
    total,
  };
}

export const getEmployee = async (id: number) => {
  return api
    .get(`/users/${id}?populate=image&filters[type][$eq]=employee`)
    .then((res) => res.data);
};

export const getManager = async (id: number) => {
  return api
    .get(`/users/${id}?populate=image&filters[type][$eq]=manager`)
    .then((res) => res.data);
};

export const getEmployeeStats = async (id: number) => {
  return api.get(`/dashboard/employee-stats/${id}`).then((res) => res.data);
};

