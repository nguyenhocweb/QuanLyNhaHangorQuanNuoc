import * as configRepo from "../repositories/config.repo.js";

export const getAdminPaymentConfig = async (systemPaymentMethodId) => {
    const config = await configRepo.getConfigByMethodId(systemPaymentMethodId);
    return { metadata: config };
};
