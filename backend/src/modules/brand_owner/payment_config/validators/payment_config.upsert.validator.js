import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const upsertBrandPaymentConfigValidator = z.object({
    body: z.object({
        isActive: demoValidator.boolean("Trạng thái kích hoạt").optional().default(true),
        isTestMode: demoValidator.boolean("Chế độ thử nghiệm").optional().default(false),
        configData: z.record(z.any(), {
            required_error: "Dữ liệu cấu hình là bắt buộc",
            invalid_type_error: "Dữ liệu cấu hình không hợp lệ"
        }),
        bankInfo: z.object({
            bankCode: demoValidator.chuoiKhongBatBuoc("Mã ngân hàng"),
            bankName: demoValidator.chuoiKhongBatBuoc("Tên ngân hàng"),
            accountNumber: demoValidator.chuoiKhongBatBuoc("Số tài khoản"),
            accountHolder: demoValidator.chuoiKhongBatBuoc("Tên chủ tài khoản"),
        }).optional()
    })
});
