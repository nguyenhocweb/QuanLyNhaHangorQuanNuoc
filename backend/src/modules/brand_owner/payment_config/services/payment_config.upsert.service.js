import { upsertBrandPaymentConfigRepo } from "../repositories/payment_config.upsert.repo.js";

export const upsertBrandPaymentConfigService = async (brandId, systemPaymentMethodId, payload) => {
    const { configData, isActive, isTestMode } = payload;

    const result = await upsertBrandPaymentConfigRepo({
        brandId,
        systemPaymentMethodId,
        configData,
        isActive,
        isTestMode
    });

    return {
        message: "Lưu cấu hình cổng thanh toán thành công",
        metadata: result
    };
};
