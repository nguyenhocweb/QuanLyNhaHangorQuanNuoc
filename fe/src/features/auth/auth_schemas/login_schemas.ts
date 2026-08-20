import {z} from "zod"
import {validator} from "@/src/core/lib/validations";
export const LoginShema=z.object({
    user_name:validator.string("Tên đăng nhập",255,8),
    password:validator.password("Mạt khẩu"),
})
export type loginForm=z.infer<typeof LoginShema>;