'use server';

import prisma from '@/lib/prisma';
import { mapFilters, mapSorting } from '@/lib/refine/utils';

// Helper to serialize BigInt/Decimal/Date for client components
const serialize = (data: any): any => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : typeof value === 'object' &&
            value !== null &&
            'd' in value &&
            'e' in value // Decimal
          ? value.toString()
          : value
    )
  );
};

export const getList = async ({
  resource,
  pagination,
  sorters,
  filters,
}: any) => {
  console.log(`[getList] resource: ${resource}`, { pagination, filters });
  const model = (prisma as any)[resource];
  if (!model) throw new Error(`Resource ${resource} not found`);

  const where = mapFilters(filters);
  const orderBy = mapSorting(sorters);
  console.log(`[getList] where:`, JSON.stringify(where, null, 2));

  const current = pagination?.current || 1;
  const pageSize = pagination?.pageSize || 10;
  const page = pagination?.current || pagination?.currentPage || 1;
  const size = pagination?.pageSize || 10;
  const skip = (page - 1) * size;

  try {
    const [data, total] = await Promise.all([
      model.findMany({
        where,
        orderBy,
        skip,
        take: size,
      }),
      model.count({ where }),
    ]);

    // Force date serialization
    const serializedData = data.map((item: any) => ({
      ...item,
      createdAt: item.createdAt?.toISOString(),
      updatedAt: item.updatedAt?.toISOString(),
      price: item.price?.toString(), // Handle Decimal
    }));

    console.log(`[getList] found ${data.length} records, total: ${total}`);

    // Use the comprehensive serialize helper for the ENTIRE response
    // This handles Decimal (originalPrice), Date, BigInt, etc. automatically
    return serialize({
      data,
      total,
    });
  } catch (error) {
    console.error(`[getList] Error:`, error);
    throw error;
  }
};

export const getOne = async ({ resource, id }: any) => {
  const model = (prisma as any)[resource];
  if (!model) throw new Error(`Resource ${resource} not found`);

  const data = await model.findUnique({
    where: { id },
  });

  return serialize({ data });
};

export const create = async ({ resource, variables }: any) => {
  const model = (prisma as any)[resource];
  if (!model) throw new Error(`Resource ${resource} not found`);

  const data = await model.create({
    data: variables,
  });

  return serialize({ data });
};

export const update = async ({ resource, id, variables }: any) => {
  const model = (prisma as any)[resource];
  if (!model) throw new Error(`Resource ${resource} not found`);

  const data = await model.update({
    where: { id },
    data: variables,
  });

  return serialize({ data });
};

export const deleteOne = async ({ resource, id }: any) => {
  const model = (prisma as any)[resource];
  if (!model) throw new Error(`Resource ${resource} not found`);

  const data = await model.delete({
    where: { id },
  });

  return serialize({ data });
};
