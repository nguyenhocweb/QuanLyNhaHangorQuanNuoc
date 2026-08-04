import { BadRequestError } from "../../../../core/constants/error/index.js";
import { getStaffsRepo } from "../repositories/staff.get.repo.js";

export const getStaffsService = async (restaurantId, query, user) => {
  if (!restaurantId) {
    throw new BadRequestError("Thiếu ID nhà hàng (restaurantId)");
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const { employments, total } = await getStaffsRepo(restaurantId, {
    skip,
    take: limit,
    search: query.search || "",
    salary_type: query.salary_type || "ALL",
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
      roleName: emp.user.role?.name || "Nhân viên",
      salary_type: user?.role === "Quản lý nhà hàng" ? emp.salary_type : null,
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
