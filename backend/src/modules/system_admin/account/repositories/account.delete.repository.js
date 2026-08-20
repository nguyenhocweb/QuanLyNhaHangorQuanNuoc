import { prisma } from "../../../../databases/init.mongodb.js";

export const accountDeleteRepository = {
  deleteUserById: async (id) => {
    return prisma.user.delete({
      where: { id }
    });
  }
};
