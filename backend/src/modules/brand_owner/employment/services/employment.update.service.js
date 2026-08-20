import { prisma } from "../../../../databases/init.mongodb.js";
import { NotFoundError, BadRequestError } from "../../../../core/constants/error/index.js";
import { updateEmploymentRepo } from "../repositories/employment.update.repo.js";
import { emitStaffUpdate, emitUserPermissionUpdate } from "../../../../core/utils/socket.js";

export const updateEmploymentService = async (employmentId, payload) => {
  const { restaurantId, isManager, permissionIds } = payload;

  // 1. Kiểm tra xem employment có tồn tại không
  const existingEmployment = await prisma.employment.findUnique({
    where: { id: employmentId },
  });

  if (!existingEmployment) {
    throw new NotFoundError("Không tìm thấy nhân viên trong hệ thống");
  }

  // 2. Tìm Role ID phù hợp
  const roleName = (restaurantId && isManager) ? "Quản lý nhà hàng" : "Nhân viên";
  const staffRole = await prisma.workspaceRole.findUnique({
    where: { name: roleName },
  });

  if (!staffRole) {
    throw new NotFoundError(`Không tìm thấy vai trò '${roleName}' trong hệ thống`);
  }

  // 3. Chuẩn bị dữ liệu cập nhật
  const updateData = {
    restaurantId,
    workspaceRoleId: staffRole.id,
    permissionIds: isManager ? [] : permissionIds, // Quản lý không cần chỉ định quyền con
  };

  // 4. Gọi Repo thực hiện cập nhật
  const updatedEmployment = await updateEmploymentRepo(employmentId, updateData);

  // 5. Phát sự kiện WebSocket theo thời gian thực
  if (updatedEmployment.restaurantId) {
    emitStaffUpdate(updatedEmployment.restaurantId);
  } else if (existingEmployment.restaurantId) {
    // Nếu bị điều chuyển khỏi nhà hàng cũ, cũng cần thông báo cho nhà hàng cũ
    emitStaffUpdate(existingEmployment.restaurantId);
  }
  emitUserPermissionUpdate(updatedEmployment.userId);

  return updatedEmployment;
};
