import { accountCreateRepository } from "../repositories/account.create.repository.js";
import { BadRequestError, NotFoundError } from "../../../../core/constants/error/index.js";
import { hashPass } from "../../../../core/utils/bcrypt.js";

export const createAccountService = async (payload) => {
  const { name, user_name, email, phone, password, roleId: roleName, status } = payload;

  // 1. Kiểm tra username, email, phone xem đã tồn tại chưa
  const existingUser = await accountCreateRepository.checkUserExists(user_name, email, phone);
  if (existingUser) {
    if (existingUser.user_name === user_name) throw new BadRequestError("Tên đăng nhập đã tồn tại");
    if (existingUser.email === email) throw new BadRequestError("Email đã tồn tại");
    if (phone && existingUser.sdt === phone) throw new BadRequestError("Số điện thoại đã tồn tại");
  }

  // 2. Lấy id_role dựa vào tên vai trò (để Frontend không phải truyền id)
  const role = await accountCreateRepository.findRoleByName(roleName);
  if (!role) {
    throw new NotFoundError(`Vai trò '${roleName}' không tồn tại trong hệ thống.`);
  }

  // 3. Hash password
  const hashedPassword = await hashPass(password);

  // 4. Tạo tài khoản
  const newUser = await accountCreateRepository.createUser({
    name,
    user_name,
    email,
    sdt: phone || null,
    password: hashedPassword,
    roleId: role.id,
    is_active: status === "LOCKED" ? "BANNED" : status, // Ánh xạ trạng thái nếu cần
    avatar: "" // Mặc định không có avatar
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: role.name
  };
};
