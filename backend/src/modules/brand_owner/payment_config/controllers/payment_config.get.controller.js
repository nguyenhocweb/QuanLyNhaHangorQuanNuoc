import { getBrandPaymentConfigsService } from "../services/payment_config.get.service.js";

export const getBrandPaymentConfigsController = async (req, res) => {
    const { id_brand } = req.params;
    const result = await getBrandPaymentConfigsService(id_brand);
    res.status(200).json(result);
};
