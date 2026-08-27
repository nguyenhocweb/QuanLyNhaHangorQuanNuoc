import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const aiModelCreateValidator = z.object({
    body: z.object({
    provider: z.enum(["OPENAI", "GEMINI", "CLAUDE", "DEEPSEEK", "MISTRAL", "GROQ", "COHERE", "AZURE_OPENAI"]),
    modelName: demoValidator.chuoi("Mã Model"),
    displayName: demoValidator.chuoi("Tên hiển thị"),
    isActive: z.boolean().optional()
  })
});