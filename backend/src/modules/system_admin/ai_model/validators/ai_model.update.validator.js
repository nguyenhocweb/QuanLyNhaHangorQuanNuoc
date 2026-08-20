import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const aiModelUpdateValidator = {
  body: z.object({
    provider: z.enum(["OPENAI", "GEMINI", "CLAUDE", "DEEPSEEK", "MISTRAL", "GROQ", "COHERE", "AZURE_OPENAI"]).optional(),
    modelName: demoValidator.chuoiKhongBatBuoc("Mã Model").optional(),
    displayName: demoValidator.chuoiKhongBatBuoc("Tên hiển thị").optional(),
    isActive: z.boolean().optional()
  })
};