import { z } from 'zod';
import { validator } from '@/src/core/lib/validations';

export const updateCategorySchema = z.object({
  id: z.string(),
  name: validator.string('Tên loại hình nhà hàng', 255, 2),
  description: z.string().optional(),
  bgColor: z.string().optional(),
  textColor: z.string().optional()
});

export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;
