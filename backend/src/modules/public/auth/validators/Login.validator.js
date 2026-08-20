import {z} from "zod"
import {demoValidator} from "../../../../core/utils/validator.js"
export default {
    body: z.object({
         user_name: demoValidator.chuoi("tên đăng nhập"),
         password: demoValidator.password("Mật khẩu")
    })
};