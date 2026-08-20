import { z} from "zod"
import { demoValidator } from "../../../core/utils/validator.js"
export default z.object({
    body:z.object({
         userId:demoValidator.chuoi("User ID"),
         name:demoValidator.chuoi("Họ và tên").optional(),
         date_of_birth:demoValidator.date_sinh("Ngày sinh",16,100).optional(),
         gender:demoValidator.gender().optional(),
    })
})