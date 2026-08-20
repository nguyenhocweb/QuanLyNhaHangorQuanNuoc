import { prisma } from "../../../../databases/init.mongodb.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../../../core/constants/error/index.js";
import { deleteStaffRepo } from "../repositories/staff.delete.repo.js";
import { emitStaffUpdate, emitUserPermissionUpdate } from "../../../../core/utils/socket.js";

export const deleteStaffService = async (restaurantId, employmentId, user) => {
  if (!restaurantId || !employmentId) {
    throw new BadRequestError("Thiếu ID nhà hàng hoặc ID biên chế nhân viên");
  }

  const isManager = user?.role === "Quản lý nhà hàng";
  const hasCreateStaffPerm = user?.permissions?.includes("CREATE_STAFF");
  
  if (user?.role === "Nhân viên" && !hasCreateStaffPerm) {
    throw new ForbiddenError("Nhân viên không có quyền rút biên chế nhân sự khỏi chi nhánh!");
  }

  const employment = await prisma.employment.findUnique({
    where: { id: employmentId },
  });

  if (!employment || employment.restaurantId !== restaurantId) {
    throw new NotFoundError("Không tìm thấy nhân viên này tại chi nhánh của bạn");
  }

  if (employment.userId === user?.id) {
    throw new BadRequestError("Bạn không thể tự rút biên chế của chính mình khỏi chi nhánh!");
  }

  const result = await deleteStaffRepo(employment.id);

  emitStaffUpdate(restaurantId);
  emitUserPermissionUpdate(employment.userId);

  return result;
};
