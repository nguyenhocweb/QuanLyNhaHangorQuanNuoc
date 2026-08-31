import { createBrandPaymentMethodService } from "../services/payment_method.create.service.js";

export const createBrandPaymentMethodController = async (req, res) => {
    const result = await createBrandPaymentMethodService(req.body);
    res.status(201).json(result);
};
