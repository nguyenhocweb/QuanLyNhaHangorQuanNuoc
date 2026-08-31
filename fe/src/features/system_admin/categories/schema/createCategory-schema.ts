import { z } from 'zod';
import { validator } from '@/src/core/lib/validations';

export const createCategorySchema = z.object({
  name: validator.string('Tên loại hình nhà hàng', 255, 2),
  icon: z.string().optional(),
  description: z.string().optional(),
  bgColor: z.string().optional(),
  textColor: z.string().optional()
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
