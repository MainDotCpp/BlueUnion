import { DataProvider } from '@refinedev/core';
import {
  getList,
  getOne,
  create,
  update,
  deleteOne,
} from '@/app/actions/data-provider';

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    return await getList({ resource, pagination, sorters, filters });
  },

  getOne: async ({ resource, id }) => {
    return await getOne({ resource, id });
  },

  create: async ({ resource, variables }) => {
    return await create({ resource, variables });
  },

  update: async ({ resource, id, variables }) => {
    return await update({ resource, id, variables });
  },

  deleteOne: async ({ resource, id }) => {
    return await deleteOne({ resource, id });
  },

  getApiUrl: () => '',
};
