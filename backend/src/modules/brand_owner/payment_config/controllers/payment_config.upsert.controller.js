import { upsertBrandPaymentConfigService } from "../services/payment_config.upsert.service.js";

export const upsertBrandPaymentConfigController = async (req, res) => {
    const { id_brand, systemPaymentMethodId } = req.params;
    const result = await upsertBrandPaymentConfigService(id_brand, systemPaymentMethodId, req.body);
    res.status(200).json(result);
};
