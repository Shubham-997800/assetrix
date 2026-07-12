import { PrismaClient } from '@prisma/client';

export const createPrismaExtension = () => {
  return {
    findManyPaginated: async (
      model: { findMany: Function; count: Function },
      args: Record<string, unknown>
    ) => {
      const { page = 1, limit = 20, where, orderBy, include, select } = args as any;
      const skip = (page - 1) * limit;

      const [items, totalItems] = await Promise.all([
        model.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          ...(include && { include }),
          ...(select && { select }),
        }),
        model.count({ where }),
      ]);

      const totalPages = Math.ceil(totalItems / limit);

      return {
        items,
        meta: {
          totalItems,
          totalPages,
          currentPage: page,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    },
  };
};
