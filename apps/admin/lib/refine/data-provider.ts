import { DataProvider } from '@refinedev/core';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${API_URL}/api/${resource}`;

    const { current = 1, pageSize = 10 } = pagination ?? {};

    const queryParams = new URLSearchParams();
    queryParams.append('page', current.toString());
    queryParams.append('limit', pageSize.toString());

    if (filters) {
      filters.forEach((filter) => {
        if ('field' in filter) {
          queryParams.append(filter.field, filter.value);
        }
      });
    }

    if (sorters && sorters.length > 0) {
      queryParams.append('sortBy', sorters[0].field);
      queryParams.append('sortOrder', sorters[0].order);
    }

    const response = await fetch(`${url}?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();

    return {
      data: data.data || [],
      total: data.total || 0,
    };
  },

  getOne: async ({ resource, id }) => {
    const url = `${API_URL}/api/${resource}/${id}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();

    return {
      data: data.data,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${API_URL}/api/${resource}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(variables),
    });

    const data = await response.json();

    return {
      data: data.data,
    };
  },

  update: async ({ resource, id, variables }) => {
    const url = `${API_URL}/api/${resource}/${id}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(variables),
    });

    const data = await response.json();

    return {
      data: data.data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const url = `${API_URL}/api/${resource}/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();

    return {
      data: data.data,
    };
  },

  getApiUrl: () => API_URL,
};
