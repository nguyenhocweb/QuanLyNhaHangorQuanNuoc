import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  description: z.string().optional(),
  icon: z.string().optional(),
  slug: z.string().optional(),
  textColor: z.string().optional(),
  bgColor: z.string().optional(),
});

export const updateTagSchema = createTagSchema.partial();

export type CreateTagFormValues = z.infer<typeof createTagSchema>;
export type UpdateTagFormValues = z.infer<typeof updateTagSchema>;
