import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const updateReviewStatusValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("ID đánh giá").regex(/^[0-9a-fA-F]{24}$/, "ID đánh giá không hợp lệ")
    }),
    body: z.object({
        status: z.enum(["PENDING", "APPROVED", "REJECTED_SPAM"])
    })
});
