import { accountUpdateRepository } from "../repositories/account.update.repository.js";
import { NotFoundError, BadRequestError } from "../../../../core/constants/error/index.js";

export const updateAccountService = async (id, payload) => {
  const { name, phone, status } = payload;
  
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.sdt = phone || null;
  if (status !== undefined) updateData.is_active = status === "LOCKED" ? "BANNED" : status;

  // First, check if user exists and is an Admin before updating
  const userCheck = await accountUpdateRepository.getUserById(id).catch(() => null);
  
  if (!userCheck) {
    throw new NotFoundError("Người dùng không tồn tại");
  }

  const roleName = typeof userCheck.role === 'object' && userCheck.role !== null ? userCheck.role.name : userCheck.role;
  if (roleName === 'Admin') {
    throw new BadRequestError("Không thể chỉnh sửa hoặc khóa tài khoản Admin hệ thống");
  }

  const existingUser = await accountUpdateRepository.updateUserById(id, updateData).catch(() => null);

  return {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    status: existingUser.is_active
  };
};
