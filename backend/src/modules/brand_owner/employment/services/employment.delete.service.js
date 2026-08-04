import { prisma } from "../../../../databases/init.mongodb.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";
import { deleteEmploymentRepo } from "../repositories/employment.delete.repo.js";
import { emitStaffUpdate, emitUserPermissionUpdate } from "../../../../core/utils/socket.js";

export const deleteEmploymentService = async (employmentId) => {
  const existingEmployment = await prisma.employment.findUnique({
    where: { id: employmentId },
  });

  if (!existingEmployment) {
    throw new NotFoundError("Không tìm thấy nhân viên trong hệ thống");
  }

  // Gọi Repo để xóa
  const deleted = await deleteEmploymentRepo(employmentId);

  // Check xem User có còn employment nào khác không, nếu không có thì set về Role SYSTEM (Người dùng)
  const otherEmployments = await prisma.employment.findFirst({
    where: { userId: deleted.userId }
  });

  if (!otherEmployments) {
    const userRole = await prisma.role.findUnique({ where: { name: "Người dùng" } });
    if (userRole) {
      await prisma.user.update({
        where: { id: deleted.userId },
        data: { roleId: userRole.id }
      });
    }
  }

  if (existingEmployment.restaurantId) {
    emitStaffUpdate(existingEmployment.restaurantId);
  }
  emitUserPermissionUpdate(deleted.userId);

  return deleted;
};
