import * as getRepo from "../repositories/web_feedback.get.repo.js";

export const getAdminFeedbacks = async (query = {}) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const status = query.status || undefined;
  const category = query.category || undefined;
  const rating = query.rating ? parseInt(query.rating) : undefined;
  const search = query.search ? query.search.trim() : undefined;
  const isFeatured = query.isFeatured !== undefined ? query.isFeatured === "true" || query.isFeatured === true : undefined;

  const { feedbacks, total } = await getRepo.getAdminFeedbacks({
    page,
    limit,
    status,
    category,
    rating,
    search,
    isFeatured
  });

  return {
    feedbacks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
};
