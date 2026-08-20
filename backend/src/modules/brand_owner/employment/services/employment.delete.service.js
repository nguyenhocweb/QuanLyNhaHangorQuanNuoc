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

  // User roles are now derived from their remaining employments or their default systemRole. No need to update the User record.

  if (existingEmployment.restaurantId) {
    emitStaffUpdate(existingEmployment.restaurantId);
  }
  emitUserPermissionUpdate(deleted.userId);

  return deleted;
};
