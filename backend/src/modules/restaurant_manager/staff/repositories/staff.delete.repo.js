import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteStaffRepo = async (employmentId) => {
  return await prisma.$transaction(async (tx) => {
    const employment = await tx.employment.findUnique({
      where: { id: employmentId },
    });

    if (!employment) return null;

    // 1. Xóa các quyền liên kết tại quán
    await tx.permission_vs_Employment.deleteMany({
      where: { employmentId },
    });

    // 2. Nếu có brandId, rút biên chế khỏi nhà hàng (set restaurantId = null)
    // Nếu không có brandId, xóa hẳn bản ghi employment
    if (employment.brandId) {
      return await tx.employment.update({
        where: { id: employmentId },
        data: { restaurantId: null },
      });
    } else {
      return await tx.employment.delete({
        where: { id: employmentId },
      });
    }
  });
};
