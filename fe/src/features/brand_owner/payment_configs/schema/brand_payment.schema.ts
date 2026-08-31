import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const bankTransferConfigSchema = z.object({
    bankCode: validator.string("Mã ngân hàng (BIN)"),
    bankName: validator.string("Tên ngân hàng"),
    accountNumber: validator.string("Số tài khoản nhận tiền"),
    accountHolder: validator.string("Tên chủ tài khoản"),
    qrTemplate: validator.string("Mẫu mã QR").optional(),
});

export type BankTransferConfigFormValues = z.infer<typeof bankTransferConfigSchema>;

export const gatewayConfigSchema = z.object({
    isActive: z.boolean().default(true),
    isTestMode: z.boolean().default(false),
    partnerCode: validator.string("Partner Code / Merchant ID").optional(),
    apiKey: validator.string("API Key").optional(),
    secretKey: validator.string("Secret Key / Hash Key").optional(),
    checksumKey: validator.string("Checksum Key").optional(),
    vnp_TmnCode: validator.string("Terminal ID (vnp_TmnCode)").optional(),
    vnp_HashSecret: validator.string("Hash Secret (vnp_HashSecret)").optional(),
    vnp_Url: validator.string("URL Cổng thanh toán").optional(),
});

export type GatewayConfigFormValues = z.infer<typeof gatewayConfigSchema>;
