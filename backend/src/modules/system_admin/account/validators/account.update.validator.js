import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const updateAccountValidator = z.object({
  params: z.object({
    id: demoValidator.chuoi("id", 1)
  }),
  body: z.object({
    name: demoValidator.chuoi("name").optional(),
    phone: z.union([demoValidator.soDienThoai(), z.literal("")]).optional(),
    status: demoValidator.chuoi("status").optional()
  }).passthrough()
});
