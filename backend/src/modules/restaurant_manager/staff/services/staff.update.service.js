import { prisma } from "../../../../databases/init.mongodb.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../../../core/constants/error/index.js";
import { updateStaffRepo } from "../repositories/staff.update.repo.js";
import { emitStaffUpdate, emitUserPermissionUpdate } from "../../../../core/utils/socket.js";

export const updateStaffService = async (restaurantId, employmentId, payload, user) => {
  if (!restaurantId || !employmentId) {
    throw new BadRequestError("Thiếu ID nhà hàng hoặc ID biên chế nhân viên");
  }

  const isManager = user?.role === "Quản lý nhà hàng";
  
  if (!isManager) {
    throw new ForbiddenError("Chỉ Quản lý nhà hàng mới có quyền sửa thông tin và phân quyền nhân sự!");
  }

  const employment = await prisma.employment.findUnique({
    where: { id: employmentId },
    include: { user: { include: { systemRole: true } }, workspaceRole: true }
  });

  if (!employment || employment.restaurantId !== restaurantId) {
    throw new NotFoundError("Không tìm thấy nhân viên này tại chi nhánh của bạn");
  }

  const { salary_type, roleName, permissionIds } = payload;
  
  if (!isManager && permissionIds && permissionIds.length > 0) {
    throw new ForbiddenError("Chỉ Quản lý nhà hàng mới có quyền phân quyền chi tiết cho nhân viên!");
  }
  
  let workspaceRoleId = undefined;

  if (roleName) {
    if (roleName === "Admin" || roleName === "Chủ thương hiệu") {
      throw new ForbiddenError("Không thể thăng chức thành Quản trị viên cấp cao tại chi nhánh");
    }
    const role = await prisma.workspaceRole.findUnique({ where: { name: roleName } });
    if (!role) throw new NotFoundError(`Vai trò '${roleName}' không tồn tại`);
    workspaceRoleId = role.id;
  }

  const result = await updateStaffRepo(employment.id, {
    workspaceRoleId,
    permissionIds,
    salary_type,
  });

  emitStaffUpdate(restaurantId);
  emitUserPermissionUpdate(employment.userId);

  return result;
};
