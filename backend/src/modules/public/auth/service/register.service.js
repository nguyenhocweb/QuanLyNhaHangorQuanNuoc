import { ConflictError } from "../../../../core/constants/error/index.js";
import { hashPass } from "../../../../core/utils/bcrypt.js";
import { registerRepo } from "../repositories/register.repo.js";

export const registerService = async ({ user_name, name, email, password, date_of_birth, gender }) => {
    // 1. Kiểm tra xem username hoặc email đã tồn tại hay chưa
    const existingUser = await registerRepo.findExistingUser({ user_name, email });
    if (existingUser) {
        if (existingUser.user_name.toLowerCase() === user_name.toLowerCase()) {
            throw new ConflictError("Tên đăng nhập này đã được sử dụng");
        }
        if (existingUser.email.toLowerCase() === email.toLowerCase()) {
            throw new ConflictError("Địa chỉ email này đã được sử dụng");
        }
    }

    // 2. Lấy SystemRole mặc định cho khách hàng ("Khách hàng")
    const customerRole = await registerRepo.getCustomerRole();
    const systemRoleId = customerRole ? customerRole.id : undefined;

    // 3. Băm mật khẩu an toàn
    const hashedPassword = await hashPass(password);

    // 4. Tạo người dùng mới trong database
    const newUser = await registerRepo.createUser({
        user_name,
        name: name || user_name,
        email,
        password: hashedPassword,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : undefined,
        gender: gender || undefined,
        systemRoleId,
        is_active: "ACTIVE"
    });

    return newUser;
};
