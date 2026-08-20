import {z} from "zod"
import { demoValidator } from "../../../../core/utils/validator.js"
export const cloudinarySignatureValidator=z.object({
    query:z.object({
    folder:demoValidator.chuoi("folder"),
    public_id:demoValidator.chuoi("tên file")
    })
})