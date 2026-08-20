import { z } from 'zod';
import { validator } from '@/src/core/lib/validations';

export const createUserSchema = z.object({
  name: validator.string('Họ và tên', 255, 1),
  user_name: validator.string('Tên đăng nhập', 50, 3),
  email: validator.email(),
  phone: z.union([validator.phone(), z.literal('')]).optional(),
  password: validator.password('Mật khẩu'),
  systemRoleId: validator.string('Vai trò', 255, 1),
  status: validator.enum('Trạng thái', ['ACTIVE', 'PENDING', 'BANNED']),
  confirmPassword: validator.string('Mật khẩu nhập lại', 255, 1)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: validator.string('Họ và tên', 255, 1).optional(),
  phone: z.union([validator.phone(), z.literal('')]).optional(),
  status: validator.enum('Trạng thái', ['ACTIVE', 'PENDING', 'BANNED']).optional(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
