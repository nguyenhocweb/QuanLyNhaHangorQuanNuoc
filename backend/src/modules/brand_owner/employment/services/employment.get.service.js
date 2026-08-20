import { BadRequestError } from "../../../../core/constants/error/index.js";
import { getEmploymentsRepo } from "../repositories/employment.get.repo.js";

export const getEmploymentsService = async (brandId, query) => {
  if (!brandId) {
    throw new BadRequestError("Brand ID is required");
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const { employments, total } = await getEmploymentsRepo(brandId, {
    skip,
    take: limit,
    search: query.search || "",
    restaurantId: query.restaurantId || null,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    items: employments.map(emp => ({
      id: emp.id,
      userId: emp.userId,
      name: emp.user.name,
      email: emp.user.email,
      avatar: emp.user.avatar,
      sdt: emp.user.sdt,
      roleName: emp.workspaceRole?.name,
      salary_type: emp.salary_type,
      restaurantId: emp.restaurantId,
      restaurantName: emp.restaurant?.name,
      createdAt: emp.createdAt,
      permissions: emp.per_vs_emp.map(p => ({
        id: p.permissions.id,
        name: p.permissions.name,
        description: p.permissions.description
      }))
    })),
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};
