import { z } from "zod";

export const branchSchema = z.object({
    name: z.string().min(1, "Tên chi nhánh không được để trống"),
    address: z.any().optional(),
    emailContact: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
    phoneContact: z.string().min(10, "Số điện thoại phải từ 10 số").optional().or(z.literal("")),
    description: z.string().optional(),
    logo: z.string().optional(),
    logoFile: z.any().optional(),
    imageMain: z.string().optional(),
    imageMainFile: z.any().optional(),
    images: z.array(z.string()).optional(),
    imagesFiles: z.any().optional(),
    statusByBrand: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    categoryIds: z.array(z.string()).optional(),
    amenityIds: z.array(z.string()).optional(),
    tagIds: z.array(z.string()).optional(),
    
    // Advanced Settings
    maxPartySize: z.coerce.number().int().min(1, "Sức chứa tối thiểu là 1").optional(),
    bookingWindowDays: z.coerce.number().int().min(0).optional(),
    cancellationHours: z.coerce.number().int().min(0).optional(),
    depositRequired: z.boolean().optional(),
    depositPerPax: z.coerce.number().int().min(0, "Số tiền cọc không hợp lệ").optional(),
    isVatInclusive: z.boolean().optional(),
    defaultVatRate: z.coerce.number().min(0).max(100).optional(),
    applyServiceCharge: z.boolean().optional(),
    serviceChargeRate: z.coerce.number().min(0).max(100).optional(),
});

export type BranchFormValues = z.infer<typeof branchSchema>;
