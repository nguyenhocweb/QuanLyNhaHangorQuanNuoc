import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const reviewReplySchema = z.object({
    staff_response: validator.string("Phản hồi").max(1000, "Phản hồi tối đa 1000 ký tự")
});

export type ReviewReplyFormValues = z.infer<typeof reviewReplySchema>;
