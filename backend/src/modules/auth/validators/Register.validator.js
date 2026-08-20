import {z} from "zod";
import { demoValidator } from "../../../core/utils/validator.js";
export default z.object({
    body:z.object({
        user_name:demoValidator.chuoi("tên đăng nhập"),
        email:demoValidator.email(),
        password:demoValidator.password("mật khẩu"),
        confirmPassword:demoValidator.chuoi("Xác nhận mật khẩu"),
        date_of_birth:demoValidator.date_sinh("Ngày sing",16,100),
        gender:demoValidator.gender(),
    }).refine((data)=>data.confirmPassword===data.password,{
        message:"xác nhận mật khẩu không khớp",
        path:["confirmPassword"]
    })
})