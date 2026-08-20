import { prisma } from "../../../../databases/init.mongodb.js";
import { hashPass } from "../../../../core/utils/bcrypt.js";
import { ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";
import { createEmploymentRepo } from "../repositories/employment.create.repo.js";

export const createEmploymentService = async (brandId, payload) => {
  const { userId, email, password, name, phone, restaurantId, isManager, permissionIds } = payload;

  if (!userId) {
    // Trường hợp 1: Tạo mới hoàn toàn
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError("Email này đã tồn tại trong hệ thống. Vui lòng sử dụng chức năng tìm kiếm người dùng.");
    }
  } else {
    // Trường hợp 2: Gán user có sẵn
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        employments: {
          include: { workspaceRole: true }
        },
        systemRole: true,
      }
    });

    if (!existingUser) {
      throw new NotFoundError("Không tìm thấy người dùng này trong hệ thống");
    }

    if (existingUser.systemRole?.name === "Admin") {
      throw new ConflictError("Không thể gán quyền nhân viên cho quản lý cấp cao");
    }
    const isBrandOwner = existingUser.employments.some(emp => emp.brandId === brandId && emp.workspaceRole?.name === "Chủ thương hiệu");
    if (isBrandOwner) {
      throw new ConflictError("Người dùng này đã là Chủ thương hiệu, không thể gán quyền nhân viên");
    }

    const alreadyEmployed = existingUser.employments.some(emp => emp.brandId === brandId);
    if (alreadyEmployed) {
      throw new ConflictError("Người dùng này đã là nhân viên của thương hiệu bạn");
    }
  }

  // 2. Tìm Role ID
  const roleName = (restaurantId && isManager) ? "Quản lý nhà hàng" : "Nhân viên";
  const staffRole = await prisma.workspaceRole.findUnique({
    where: { name: roleName },
  });

  if (!staffRole) {
    throw new NotFoundError(`Không tìm thấy vai trò '${roleName}' trong hệ thống`);
  }

  // 3. Hash password (chỉ khi tạo mới)
  let passwordHash = null;
  if (!userId && password) {
    passwordHash = await hashPass(password);
  }

  // 4. Tạo nhân viên thông qua repo transaction
  const result = await createEmploymentRepo({
    userId,
    name,
    email,
    passwordHash,
    phone,
    workspaceRoleId: staffRole.id,
    brandId,
    restaurantId,
    permissionIds,
  });

  return result;
};
