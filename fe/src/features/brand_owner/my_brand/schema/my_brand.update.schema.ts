import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const updateMyBrandSchema = z.object({
    name: validator.string("Tên thương hiệu"),
    taxCode: validator.string("Mã số thuế", 100).optional().or(z.literal("")),
    emailContact: validator.email().optional().or(z.literal("")),
    phoneContact: validator.phone().optional().or(z.literal("")),
    link: validator.url("Website/Link").optional().or(z.literal("")),
    address: validator.object("Địa chỉ", {
        street: z.string().optional(),
        ward: z.string().optional(),
        wardCode: z.string().optional(),
        district: z.string().optional(),
        districtCode: z.string().optional(),
        province: z.string().optional(),
        provinceCode: z.string().optional()
    }).optional(),
    is_featured: validator.boolean("Nổi bật").optional(),
    FileLogo: validator.file("Logo thương hiệu").optional().or(z.any().optional()),
    FileImageMain: validator.file("Ảnh bìa chính").optional().or(z.any().optional()),
    
    // Thuế & Phí
    isVatInclusive: z.boolean().optional(),
    defaultVatRate: validator.number("Mức VAT mặc định", 0, 100).optional().or(z.literal("")),
    applyServiceCharge: z.boolean().optional(),
    serviceChargeRate: validator.number("Tỉ lệ phí dịch vụ", 0, 100).optional().or(z.literal("")),
    forceGlobalTaxConfig: z.boolean().optional(),
    inventoryApprovalThreshold: validator.number("Hạn mức tự duyệt", 0).optional().or(z.literal("")),
});

export type UpdateMyBrandFormValues = z.infer<typeof updateMyBrandSchema>;
