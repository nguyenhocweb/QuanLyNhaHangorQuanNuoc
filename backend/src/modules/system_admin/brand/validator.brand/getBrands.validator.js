import {demoValidator} from "../../../../core/utils/validator.js";
import {z} from "zod"
export default z.object({
    query:z.object({
        page:demoValidator.int("page",1,255),
        limit:demoValidator.int("limit",1,255),
        search:demoValidator.chuoi("search",0,255).optional(),
        status: z.enum(["ACTIVE", "PENDING", "INACTIVE", "TERMINATED"]).optional(),
    })
})