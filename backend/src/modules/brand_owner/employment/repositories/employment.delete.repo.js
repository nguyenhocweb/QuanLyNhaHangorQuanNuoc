import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteEmploymentRepo = async (employmentId) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Xóa các quyền liên kết
    await tx.permission_vs_Employment.deleteMany({
      where: { employmentId: employmentId },
    });

    // 2. Xóa bản ghi Employment
    const deletedEmployment = await tx.employment.delete({
      where: { id: employmentId },
    });

    return deletedEmployment;
  });
};
