import { z } from "zod";

export const createAmenitySchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  description: z.string().optional(),
  icon: z.string().optional(),
  slug: z.string().optional(),
});

export const updateAmenitySchema = createAmenitySchema.partial();

export type CreateAmenityFormValues = z.infer<typeof createAmenitySchema>;
export type UpdateAmenityFormValues = z.infer<typeof updateAmenitySchema>;
