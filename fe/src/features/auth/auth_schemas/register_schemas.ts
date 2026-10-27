import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const RegisterSchema = z
    .object({
        user_name: validator.string("Tên đăng nhập", 50, 3),
        name: z.string().trim().optional(),
        email: validator.email(),
        password: validator.password("Mật khẩu"),
        confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
        date_of_birth: z.string().optional(),
        gender: z.string().optional(),
    })
    .refine((data) => data.confirmPassword === data.password, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
