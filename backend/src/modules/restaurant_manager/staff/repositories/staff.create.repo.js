import { prisma } from "../../../../databases/init.mongodb.js";

export const createStaffRepo = async ({ userId, name, email, passwordHash, phone, roleId, brandId, restaurantId, permissionIds, salary_type }) => {
  return await prisma.$transaction(async (tx) => {
    let finalUserId = userId;

    // 1. Tạo hoặc cập nhật role cho User
    if (!finalUserId) {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          sdt: phone,
          roleId,
        },
      });
      finalUserId = newUser.id;
    } else {
      await tx.user.update({
        where: { id: finalUserId },
        data: { roleId },
      });
    }

    // 2. Tạo Employment cho nhà hàng
    const newEmployment = await tx.employment.create({
      data: {
        userId: finalUserId,
        brandId,
        restaurantId,
        salary_type: salary_type || null,
      },
    });

    // 3. Phân quyền con
    if (permissionIds && permissionIds.length > 0) {
      await tx.permission_vs_Employment.createMany({
        data: permissionIds.map((pId) => ({
          employmentId: newEmployment.id,
          permissionId: pId,
        })),
      });
    }

    // 4. Lấy dữ liệu hoàn chỉnh trả về
    return await tx.employment.findUnique({
      where: { id: newEmployment.id },
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
