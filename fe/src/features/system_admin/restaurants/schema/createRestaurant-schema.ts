import { z } from 'zod';

export const createRestaurantSchema = z.object({
  name: z.string().min(1, 'Tên nhà hàng không được để trống').max(255, 'Tên nhà hàng quá dài'),
  brandId: z.string().min(1, 'Vui lòng chọn thương hiệu'),
  address: z.object({
    street: z.string().optional(),
    ward: z.string().optional(),
    wardCode: z.string().optional(),
    district: z.string().optional(),
    districtCode: z.string().optional(),
    province: z.string().optional(),
    provinceCode: z.string().optional()
  }).optional(),
  email_contact: z.string().min(1, 'Email không được để trống').email('Email không đúng định dạng'),
  phone_contact: z.string().min(1, 'Số điện thoại không được để trống'),
  description: z.string().optional(),
  max_party_size: z.any().optional(),
  booking_window_days: z.any().optional(),
  cancellation_hours: z.any().optional(),
  deposit_required: z.boolean().optional(),
  deposit_amount: z.any().optional(),
  categoryIds: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất 1 loại nhà hàng'),
  logoFile: z.any().optional(),
  imageMainFile: z.any().refine(val => !!val, 'Ảnh chính không được để trống'),
  imagesFiles: z.any().optional(),
});

export type CreateRestaurantFormValues = z.infer<typeof createRestaurantSchema>;
