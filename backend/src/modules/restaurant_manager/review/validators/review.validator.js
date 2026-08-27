import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

const replyValidator = z.object({
    body: z.object({
        staff_response: demoValidator.chuoi("Nội dung phản hồi")
    })
});

const statusValidator = z.object({
    body: z.object({
        status: z.enum(["APPROVED", "PENDING", "REJECTED_SPAM"], {
            required_error: "Trạng thái không được để trống"
        })
    })
});

export default { replyValidator, statusValidator };