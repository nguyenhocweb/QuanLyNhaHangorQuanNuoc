import * as z from "zod";

export const upgradeSchema = z.object({
  brandName: z.string().min(2, "Tên thương hiệu phải có ít nhất 2 ký tự"),
  taxCode: z.string().optional(),
  businessLicenseFile: z.any().refine((file) => file !== null && file !== undefined, "Vui lòng chọn ảnh giấy phép kinh doanh"),
});

export type UpgradeFormValues = z.infer<typeof upgradeSchema>;
