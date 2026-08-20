import { prisma } from "../../../../databases/init.mongodb.js";

export const accountCreateRepository = {
  findRoleByName: async (roleName) => {
    return prisma.systemRole.findFirst({
      where: {
        name: roleName
      }
    });
  },
  
  checkUserExists: async (userName, email, phone) => {
    const OR = [{ user_name: userName }, { email }];
    if (phone) OR.push({ sdt: phone });

    return prisma.user.findFirst({
      where: { OR }
    });
  },

  createUser: async (userData) => {
    return prisma.user.create({
      data: userData
    });
  }
};
