import { demoValidator } from "../../../../core/utils/validator.js";
import z from "zod";
export default z.object({
    params:z.object({
        id:demoValidator.chuoi("id nhà hàng"),
    })
}) 