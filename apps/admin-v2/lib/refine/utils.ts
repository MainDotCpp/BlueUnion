import { CrudFilters, CrudSorting, LogicalFilter } from '@refinedev/core';

export const mapFilters = (filters?: CrudFilters) => {
  if (!filters || filters.length === 0) {
    return {};
  }

  const where: any = {};

  filters.map((filter) => {
    if (
      filter.operator !== 'or' &&
      filter.operator !== 'and' &&
      'field' in filter
    ) {
      const { field, operator, value } = filter;

      switch (operator) {
        case 'eq':
          where[field] = value;
          break;
        case 'ne':
          where[field] = { not: value };
          break;
        case 'lt':
          where[field] = { lt: value };
          break;
        case 'gt':
          where[field] = { gt: value };
          break;
        case 'lte':
          where[field] = { lte: value };
          break;
        case 'gte':
          where[field] = { gte: value };
          break;
        case 'contains':
          where[field] = { contains: value, mode: 'insensitive' };
          break;
        case 'in':
          where[field] = { in: value };
          break;
        case 'nin':
          where[field] = { notIn: value };
          break;
        // Add more operators as needed
      }
    }
  });

  return where;
};

export const mapSorting = (sorters?: CrudSorting) => {
  if (!sorters || sorters.length === 0) {
    return undefined;
  }

  return sorters.map((sorter) => ({
    [sorter.field]: sorter.order,
  }));
};
