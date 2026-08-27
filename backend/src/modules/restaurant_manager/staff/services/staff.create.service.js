import { prisma } from "../../../../databases/init.mongodb.js";
import { hashPass } from "../../../../core/utils/bcrypt.js";
import { ConflictError, NotFoundError, ForbiddenError, BadRequestError } from "../../../../core/constants/error/index.js";
import { createStaffRepo } from "../repositories/staff.create.repo.js";
import { emitStaffUpdate } from "../../../../core/utils/socket.js";

export const createStaffService = async (restaurantId, payload, user) => {
  if (!restaurantId) {
    throw new BadRequestError("Thiếu ID nhà hàng (restaurantId)");
  }

  const isManager = user?.role === "Quản lý nhà hàng";
  const hasCreateStaffPerm = user?.permissions?.includes("CREATE_STAFF");
  
  if (user?.role === "Nhân viên" && !hasCreateStaffPerm) {
    throw new ForbiddenError("Nhân viên không có quyền tuyển dụng hoặc thêm nhân sự vào chi nhánh!");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { id: true, brandId: true, name: true }
  });

  if (!restaurant) {
    throw new NotFoundError("Nhà hàng không tồn tại");
  }

  const { userId, email, password, name, phone, permissionIds, salary_type, roleName = "Nhân viên" } = payload;

  if (!isManager && permissionIds && permissionIds.length > 0) {
    throw new ForbiddenError("Chỉ Quản lý nhà hàng mới có quyền phân quyền chi tiết cho nhân viên!");
  }
  if (roleName === "Admin" || roleName === "Quản lý thương hiệu") {
    throw new ForbiddenError("Không thể cấp vai trò Quản trị viên cấp cao tại chi nhánh");
  }

  if (!userId) {
    if (!email) throw new BadRequestError("Vui lòng cung cấp email nhân viên");
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictError("Email này đã tồn tại trong hệ thống. Vui lòng sử dụng chức năng chọn nhân viên có sẵn.");
    }
  } else {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { employments: true }
    });
    if (!existingUser) throw new NotFoundError("Không tìm thấy người dùng");

    const alreadyInBranch = existingUser.employments.some(emp => emp.restaurantId === restaurantId);
    if (alreadyInBranch) {
      throw new ConflictError("Nhân viên này đã làm việc tại chi nhánh của bạn");
    }
  }

  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });
  if (!role) throw new NotFoundError(`Không tìm thấy vai trò '${roleName}'`);

  let passwordHash = null;
  if (!userId && password) {
    passwordHash = await hashPass(password);
  }

  const result = await createStaffRepo({
    userId,
    name,
    email,
    passwordHash,
    phone,
    workspaceRoleId: role.id,
    brandId: restaurant.brandId,
    restaurantId,
    permissionIds,
    salary_type,
  });

  emitStaffUpdate(restaurantId);

  return result;
};
