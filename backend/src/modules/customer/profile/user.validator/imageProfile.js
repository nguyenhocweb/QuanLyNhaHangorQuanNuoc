import {z} from "zod"
import { demoValidator } from "../../../../core/utils/validator.js"
export default z.object({
    body:z.object({
         urlAvatar:demoValidator.chuoi("link ảnh"),
         id:demoValidator.chuoi("id người dùng")
    })
})