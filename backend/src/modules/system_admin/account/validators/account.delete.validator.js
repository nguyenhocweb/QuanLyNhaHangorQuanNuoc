import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const deleteAccountValidator = z.object({
  params: z.object({
    id: demoValidator.chuoi("id", 1)
  })
});
