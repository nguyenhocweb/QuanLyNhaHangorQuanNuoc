import { prisma } from "../../../../databases/init.mongodb.js";

export const accountUpdateRepository = {
  getUserById: async (id) => {
    return prisma.user.findUnique({
      where: { id },
      include: {
        role: true
      }
    });
  },
  updateUserById: async (id, payload) => {
    return prisma.user.update({
      where: { id },
      data: payload
    });
  }
};
