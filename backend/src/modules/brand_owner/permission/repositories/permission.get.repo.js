import { prisma } from "../../../../databases/init.mongodb.js";

export const getPermissionsRepo = async () => {
  return await prisma.permission.findMany({
    where: {
      type: {
        in: ["RESTAURANT", "BRAND"],
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
    },
  });
};
