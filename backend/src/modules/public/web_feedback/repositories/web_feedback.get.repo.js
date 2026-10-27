import { prisma } from "../../../../databases/init.mongodb.js";
import { FeedbackStatus } from "../../../../databases/prisma/generated/prisma/index.js";

export const getPublicFeedbacks = async ({ page = 1, limit = 10, category, isFeatured }) => {
  const skip = (page - 1) * limit;
  const where = {
    status: FeedbackStatus.APPROVED,
    ...(category ? { category } : {}),
    ...(isFeatured !== undefined ? { isFeatured } : {})
  };

  const [feedbacks, total] = await Promise.all([
    prisma.webFeedback.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        guestName: true,
        rating: true,
        title: true,
        content: true,
        category: true,
        isFeatured: true,
        adminReply: true,
        repliedAt: true,
        isHelpfulCount: true,
        createdAt: true
      }
    }),
    prisma.webFeedback.count({ where })
  ]);

  return { feedbacks, total };
};

export const getFeedbackStats = async () => {
  const approvedWhere = { status: FeedbackStatus.APPROVED };
  const [total, aggregations] = await Promise.all([
    prisma.webFeedback.count({ where: approvedWhere }),
    prisma.webFeedback.aggregate({
      where: approvedWhere,
      _avg: { rating: true }
    })
  ]);

  return {
    totalReviews: total,
    averageRating: aggregations._avg.rating ? Number(aggregations._avg.rating.toFixed(1)) : 5.0
  };
};
