import { demoValidator } from "../../../../../core/utils/validator.js";
import z from "zod";

export const sepayWebhookValidator = {
  body: z.object({
    amountIn: z.number().optional(),
    amountOut: z.number().optional(),
    transactionContent: z.string().optional(),
    referenceNumber: z.string().optional(),
  }).passthrough(),
  query: z.object({
    token: z.string({ required_error: "Token là bắt buộc" })
  })
};
