import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const createWebFeedbackSchema = z.object({
  rating: validator.number("Điểm đánh giá", 1, 5),
  content: validator.string("Nội dung đánh giá", 2000, 5),
  title: z.string().optional(),
  category: z.enum(["UI_UX", "PERFORMANCE", "FEATURE", "BUG_REPORT", "GENERAL"]).default("GENERAL"),
  guestName: z.string().optional(),
  guestEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  guestPhone: z.string().optional().or(z.literal("")),
  pageUrl: z.string().optional(),
  deviceInfo: z.string().optional(),
  screenResolution: z.string().optional(),
  attachments: z.array(z.string()).optional()
});

export type CreateWebFeedbackFormValues = z.infer<typeof createWebFeedbackSchema>;
