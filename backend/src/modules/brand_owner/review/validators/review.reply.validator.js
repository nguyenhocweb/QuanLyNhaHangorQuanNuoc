import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const replyReviewValidator = z.object({
    params: z.object({
        id_brand: demoValidator.chuoi("ID thương hiệu").regex(/^[0-9a-fA-F]{24}$/, "ID thương hiệu không hợp lệ"),
        id: demoValidator.chuoi("ID đánh giá").regex(/^[0-9a-fA-F]{24}$/, "ID đánh giá không hợp lệ")
    }),
    body: z.object({
        staff_response: z.string().max(1000, "Phản hồi tối đa 1000 ký tự")
    })
});
