import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const updateBrandValidator = z.object({
    body: z.object({
        name: demoValidator.chuoi("Tên thương hiệu"),
        taxCode: z.string().max(100, "Mã số thuế không được vượt quá 100 ký tự").optional().or(z.literal("")),
        emailContact: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
        phoneContact: z.string().max(20, "Số điện thoại không được vượt quá 20 ký tự").optional().or(z.literal("")),
        link: z.string().url("Website/Link không hợp lệ").max(255, "Website/Link không được vượt quá 255 ký tự").optional().or(z.literal("")),
        address: z.object({
            street: z.string().optional(),
            ward: z.string().optional(),
            wardCode: z.string().optional(),
            district: z.string().optional(),
            districtCode: z.string().optional(),
            province: z.string().optional(),
            provinceCode: z.string().optional()
        }).optional(),
        is_featured: z.boolean().optional(),
        logo: z.string().url("Logo URL không hợp lệ").optional(),
        imageMain: z.string().url("Image URL không hợp lệ").optional(),
        isVatInclusive: z.boolean().optional(),
        defaultVatRate: z.number().min(0).max(100).optional(),
        applyServiceCharge: z.boolean().optional(),
        serviceChargeRate: z.number().min(0).max(100).optional(),
        forceGlobalTaxConfig: z.boolean().optional(),
        inventoryApprovalThreshold: z.number().min(0).optional(),
    })
});
