import * as getRepo from "../repositories/web_feedback.get.repo.js";

export const getPublicFeedbacks = async (query = {}) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const category = query.category || undefined;
  const isFeatured = query.isFeatured !== undefined ? query.isFeatured === "true" || query.isFeatured === true : undefined;

  const { feedbacks, total } = await getRepo.getPublicFeedbacks({ page, limit, category, isFeatured });
  const stats = await getRepo.getFeedbackStats();

  return {
    feedbacks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    },
    stats
  };
};
