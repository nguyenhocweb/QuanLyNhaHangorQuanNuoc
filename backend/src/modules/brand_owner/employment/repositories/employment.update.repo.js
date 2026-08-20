import { prisma } from "../../../../databases/init.mongodb.js";

export const updateEmploymentRepo = async (employmentId, { restaurantId, workspaceRoleId, permissionIds }) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Cập nhật thông tin cơ bản của Employment
    const updatedEmployment = await tx.employment.update({
      where: { id: employmentId },
      data: {
        restaurantId: restaurantId || null,
        workspaceRoleId: workspaceRoleId, // Added here
      },
    });

    // 2. Xóa các quyền cũ
    await tx.permission_vs_Employment.deleteMany({
      where: { employmentId: employmentId },
    });

    // 3. Thêm các quyền mới
    if (permissionIds && permissionIds.length > 0) {
      await tx.permission_vs_Employment.createMany({
        data: permissionIds.map((pId) => ({
          employmentId: employmentId,
          permissionId: pId,
        })),
      });
    }

    return updatedEmployment;
  });
};
