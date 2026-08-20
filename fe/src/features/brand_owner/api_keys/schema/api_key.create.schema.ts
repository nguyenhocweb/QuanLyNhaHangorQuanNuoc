import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const apiKeyCreateSchema = z.object({
  name: validator.string("Tên gợi nhớ"),
  providedKey: z.string().min(1, "Vui lòng nhập API Key"),
  chatboxId: z.string().min(1, "Vui lòng chọn Nhà cung cấp"),
  restrictedModelId: z.string().optional(),
  contactEmail: z.union([z.literal(""), validator.email()]).optional(),
});

export type ApiKeyCreateValues = z.infer<typeof apiKeyCreateSchema>;
