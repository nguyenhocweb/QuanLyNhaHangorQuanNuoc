import * as z from "zod";
import { validator } from "@/src/core/lib/validations";

export const upgradeSchema = z.object({
  // Bước 1: Nhận diện Thương hiệu
  brandName: validator.string("Tên thương hiệu", 100, 2),
  logoFile: z.any().optional().nullable(),
  description: z.string().max(500, "Mô tả không vượt quá 500 ký tự").optional(),

  // Bước 2: Người đại diện & Trụ sở
  representativeName: validator.string("Họ tên người đại diện", 100, 2),
  phoneContact: validator.phone(),
  emailContact: validator.email(),
  street: validator.string("Địa chỉ số nhà, tên đường", 200, 2),
  province: validator.string("Tỉnh / Thành phố", 100, 1),
  district: validator.string("Quận / Huyện", 100, 1),
  ward: validator.string("Phường / Xã", 100, 1),

  // Bước 3: Hồ sơ Pháp lý (KYB)
  taxCode: z.string().optional().refine((val) => !val || /^[0-9-]{10,14}$/.test(val), {
    message: "Mã số thuế không hợp lệ (10 hoặc 13 chữ số)"
  }),
  businessLicenseFile: z.any().refine((file) => file !== null && file !== undefined, "Vui lòng tải lên Giấy phép kinh doanh (ảnh hoặc PDF)"),
  identityCardFrontFile: z.any().optional().nullable(),
  identityCardBackFile: z.any().optional().nullable(),
  agreeTerms: z.boolean().refine((val) => val === true, "Bạn phải đồng ý với Điều khoản và Cam kết trách nhiệm pháp lý"),
});

export type UpgradeFormValues = z.infer<typeof upgradeSchema>;
