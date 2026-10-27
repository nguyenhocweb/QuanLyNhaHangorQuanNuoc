import { prisma } from "../../../../databases/init.mongodb.js";

export const getAdminFeedbacks = async ({ page = 1, limit = 10, status, category, rating, search, isFeatured }) => {
  const skip = (page - 1) * limit;
  const where = {
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    ...(rating ? { rating: Number(rating) } : {}),
    ...(isFeatured !== undefined ? { isFeatured } : {}),
    ...(search
      ? {
          OR: [
            { guestName: { contains: search, mode: "insensitive" } },
            { guestEmail: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
            { title: { contains: search, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const [feedbacks, total] = await Promise.all([
    prisma.webFeedback.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.webFeedback.count({ where })
  ]);

  return { feedbacks, total };
};

export const findFeedbackById = async (id) => {
  return await prisma.webFeedback.findUnique({
    where: { id }
  });
};
