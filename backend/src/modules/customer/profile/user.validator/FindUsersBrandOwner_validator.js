import { demoValidator } from "../../../../core/utils/validator.js";
import z from "zod";
export default z.object({
    query:z.object({
        search:demoValidator.chuoi("tìm brand owner").optional()
    })
})