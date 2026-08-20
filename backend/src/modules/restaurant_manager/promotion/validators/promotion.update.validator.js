import { z } from 'zod';
import { createPromotionValidator } from './promotion.create.validator.js';

export const updatePromotionValidator = z.object({
  body: createPromotionValidator.shape.body.partial()
});
