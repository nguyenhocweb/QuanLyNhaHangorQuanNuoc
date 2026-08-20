import * as configRepo from "../repositories/config.repo.js";

export const upsertAdminPaymentConfig = async (systemPaymentMethodId, configData, isActive) => {
    const config = await configRepo.upsertConfig(systemPaymentMethodId, configData, isActive);
    return { metadata: config };
};
