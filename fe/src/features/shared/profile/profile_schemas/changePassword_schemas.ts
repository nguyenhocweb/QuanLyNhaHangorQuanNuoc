
import {z} from "zod";
import { validator } from "@/src/core/lib/validations";
export const ChangePasswordSchemas=z.object({
    id:validator.string("id người dùng"),
    currentPassword:validator.password("Mật khẩu cũ"),
    newPassword:validator.password("Mật khẩu mới"),
    confirmNewPassword:validator.password("xác nhận mật khẩu mới")
}).refine(data=>
    data.newPassword===data.confirmNewPassword,
    {
        message: "Mật khẩu xác nhận không khớp",
        path:["confirmNewPassword"]  // nơi thông báo lỗi
    }
)
export type ChangePasswordForm=z.Infer<typeof ChangePasswordSchemas>