import { prisma } from "../../../../databases/init.mongodb.js";

export const updateStaffRepo = async (employmentId, { salary_type, roleId, permissionIds }) => {
  return await prisma.$transaction(async (tx) => {
    const dataToUpdate = {};
    if (salary_type !== undefined) {
      dataToUpdate.salary_type = salary_type || null;
    }

    const updatedEmployment = await tx.employment.update({
      where: { id: employmentId },
      data: dataToUpdate,
    });

    if (permissionIds !== undefined) {
      await tx.permission_vs_Employment.deleteMany({
        where: { employmentId },
      });

      if (permissionIds.length > 0) {
        await tx.permission_vs_Employment.createMany({
          data: permissionIds.map((pId) => ({
            employmentId,
            permissionId: pId,
          })),
        });
      }
    }

    if (roleId) {
      await tx.user.update({
        where: { id: updatedEmployment.userId },
        data: { roleId },
      });
    }

    return await tx.employment.findUnique({
      where: { id: employmentId },
      include: {
        user: {
          select: { id: true, name: true, email: true, sdt: true, avatar: true, role: { select: { name: true } } },
        },
        restaurant: {
          select: { id: true, name: true },
        },
        per_vs_emp: {
          include: {
            permissions: true,
          },
        },
      },
    });
  });
};
