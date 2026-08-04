import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Tìm kiếm người dùng dựa trên email, số điện thoại, hoặc tên
 */
export const searchUsersRepo = async (keyword) => {
  return await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: keyword, mode: "insensitive" } },
        { sdt: { contains: keyword, mode: "insensitive" } },
        { name: { contains: keyword, mode: "insensitive" } },
        { user_name: { contains: keyword, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      sdt: true,
      avatar: true,
    },
    take: 10, // Limit to 10 results for performance and safety
  });
};
