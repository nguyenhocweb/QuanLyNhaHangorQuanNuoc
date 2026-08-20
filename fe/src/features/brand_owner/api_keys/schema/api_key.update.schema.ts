import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const apiKeyUpdateSchema = z.object({
  name: validator.string("Tên gợi nhớ"),
  restrictedModelId: z.string().optional(),
  contactEmail: z.union([z.literal(""), validator.email()]).optional(),
});

export type ApiKeyUpdateValues = z.infer<typeof apiKeyUpdateSchema>;
