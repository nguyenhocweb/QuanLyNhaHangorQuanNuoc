import { z } from "zod"
import { demoValidator } from "../../../../core/utils/validator.js"
export const cloudinarySignatureBulkValidator = z.object({
    query: z.object({
        folder: demoValidator.chuoi("folder"),
        public_ids: demoValidator.array("danh sách tên file", demoValidator.chuoi(" tên file"), 1),
    })
})