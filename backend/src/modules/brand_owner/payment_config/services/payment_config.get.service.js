import { NotFoundError } from "../../../../core/constants/error/index.js";
import { getBrandPaymentConfigsRepo } from "../repositories/payment_config.get.repo.js";

export const getBrandPaymentConfigsService = async (brandId) => {
    const { systemMethods, brandConfigs, brand } = await getBrandPaymentConfigsRepo(brandId);
    if (!brand) {
        throw new NotFoundError("Không tìm thấy thông tin thương hiệu");
    }

    // Ghép từng SystemPaymentMethod với BrandPaymentConfig tương ứng
    const combinedMethods = systemMethods.map(method => {
        const config = brandConfigs.find(c => c.systemPaymentMethodId === method.id) || null;
        return {
            method,
            config: config ? {
                id: config.id,
                brandId: config.brandId,
                systemPaymentMethodId: config.systemPaymentMethodId,
                configData: config.configData,
                isActive: config.isActive,
                isTestMode: config.isTestMode,
                updatedAt: config.updatedAt
            } : null
        };
    });

    return {
        message: "Lấy cấu hình phương thức thanh toán thương hiệu thành công",
        metadata: {
            brand,
            paymentMethods: combinedMethods
        }
    };
};
