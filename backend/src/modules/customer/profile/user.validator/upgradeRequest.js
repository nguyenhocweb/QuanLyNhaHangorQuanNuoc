import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

const upgradeRequest = {
    body: z.object({
        brandName: demoValidator.chuoi("Tên thương hiệu"),
        logo: z.string().url("Đường dẫn logo không hợp lệ").optional().or(z.literal("")),
        description: z.string().optional(),
        
        representativeName: demoValidator.chuoi("Họ tên người đại diện").optional(),
        phoneContact: demoValidator.soDienThoai("Số điện thoại liên hệ").optional(),
        emailContact: demoValidator.email("Email liên hệ").optional(),
        address: z.object({
            street: z.string().optional(),
            ward: z.string().optional(),
            wardCode: z.string().optional(),
            district: z.string().optional(),
            districtCode: z.string().optional(),
            province: z.string().optional(),
            provinceCode: z.string().optional(),
        }).optional(),

        taxCode: z.string().optional(),
        businessLicense: z.string().url("Đường dẫn giấy phép kinh doanh không hợp lệ").optional().or(z.literal("")),
        identityCard: z.array(z.string()).optional().default([]),
    })
};

export default upgradeRequest;
