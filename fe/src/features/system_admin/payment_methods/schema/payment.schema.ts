import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

// Schema cho Tab 1: Thông tin chung
export const methodMetadataSchema = z.object({
    name: validator.string("Tên phương thức"),
    code: validator.string("Mã phương thức").toUpperCase(),
    description: z.string().optional().nullable(),
    iconUrl: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
});

export type MethodMetadataFormValues = z.infer<typeof methodMetadataSchema>;

// Cấu trúc base cho mọi API Config
const baseConfig = {
    isActive: z.boolean().default(true),
    isTestMode: z.boolean().default(true),
};

// Zod Discriminated Union cho Tab 2: Cấu hình API dựa theo Mã phương thức (providerCode)
const vnpayConfigSchema = z.object({
    providerCode: z.literal("VNPAY"),
    configData: z.object({
        vnp_TmnCode: validator.string("Mã Terminal (vnp_TmnCode)"),
        vnp_HashSecret: validator.string("Mã Bảo Mật (vnp_HashSecret)"),
        vnp_Url: validator.string("Payment URL (vnp_Url)"),
    }),
    ...baseConfig
});

const momoConfigSchema = z.object({
    providerCode: z.literal("MOMO"),
    configData: z.object({
        partnerCode: validator.string("Partner Code"),
        accessKey: validator.string("Access Key"),
        secretKey: validator.string("Secret Key"),
    }),
    ...baseConfig
});

const payosConfigSchema = z.object({
    providerCode: z.literal("PAYOS"),
    configData: z.object({
        clientId: validator.string("Client ID"),
        apiKey: validator.string("API Key"),
        checksumKey: validator.string("Checksum Key"),
    }),
    ...baseConfig
});

const sepayConfigSchema = z.object({
    providerCode: z.literal("SEPAY"),
    configData: z.object({
        apiToken: validator.string("API Token"),
    }),
    ...baseConfig
});

const bankTransferConfigSchema = z.object({
    providerCode: z.literal("BANK_TRANSFER"),
    configData: z.object({
        bankName: validator.string("Tên ngân hàng"),
        accountNumber: validator.string("Số tài khoản"),
        accountName: validator.string("Tên chủ tài khoản"),
    }),
    ...baseConfig
});

const cashConfigSchema = z.object({
    providerCode: z.literal("CASH"),
    configData: z.any().optional(),
    ...baseConfig
});

const zalopayConfigSchema = z.object({
    providerCode: z.literal("ZALOPAY"),
    configData: z.any().optional(),
    ...baseConfig
});

export const apiConfigSchema = z.discriminatedUnion("providerCode", [
    vnpayConfigSchema,
    momoConfigSchema,
    payosConfigSchema,
    sepayConfigSchema,
    bankTransferConfigSchema,
    cashConfigSchema,
    zalopayConfigSchema
]);

export type ApiConfigFormValues = z.infer<typeof apiConfigSchema>;
