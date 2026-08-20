import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const apiKeySchema = z.object({
  name: validator.string("Tên gợi nhớ"),
  providedKey: validator.string("Khóa API thật"),
  chatboxId: validator.string("Nhà cung cấp (Chatbox)"),
  restrictedModelId: z.string().optional(),
  keyType: z.enum(["ADMIN", "CUSTOMER", "BRAND"]).default("BRAND"),
  brandId: z.string().optional(),
  contactEmail: validator.email().optional(),
});

export type ApiKeyFormValues = z.infer<typeof apiKeySchema>;
