import { prisma } from "../../../../databases/init.mongodb.js";

export const accountGetRepository = {
  getUsers: async (where, skip, limit) => {
    return prisma.user.findMany({
      where,
      skip,
      take: limit,
      include: {
        role: true,
        employments: {
          include: {
            brand: {
              select: { name: true }
            },
            restaurant: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  },

  countUsersByCondition: async (where = {}) => {
    return prisma.user.count({ where });
  }
};
