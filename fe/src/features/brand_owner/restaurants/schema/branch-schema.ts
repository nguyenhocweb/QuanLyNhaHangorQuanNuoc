import { z } from "zod";

export const branchSchema = z.object({
    name: z.string().min(1, "Tên chi nhánh không được để trống"),
    address: z.any().optional(),
    email_contact: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
    phone_contact: z.string().min(10, "Số điện thoại phải từ 10 số").optional().or(z.literal("")),
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
    max_party_size: z.coerce.number().int().min(1, "Sức chứa tối thiểu là 1").optional(),
    booking_window_days: z.coerce.number().int().min(0).optional(),
    cancellation_hours: z.coerce.number().int().min(0).optional(),
    deposit_required: z.boolean().optional(),
    deposit_amount: z.coerce.number().int().min(0, "Số tiền cọc không hợp lệ").optional(),
});

export type BranchFormValues = z.infer<typeof branchSchema>;
