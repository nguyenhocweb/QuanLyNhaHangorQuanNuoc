import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const createAccountValidator = z.object({
  body: z.object({
    name: demoValidator.chuoi("name", 1),
    user_name: demoValidator.chuoi("user_name", 3),
    email: demoValidator.email(),
    phone: z.union([demoValidator.soDienThoai(), z.literal("")]).optional(),
    password: demoValidator.password(),
    roleId: demoValidator.chuoi("roleId", 1),
    status: demoValidator.chuoi("status")
  })
});
