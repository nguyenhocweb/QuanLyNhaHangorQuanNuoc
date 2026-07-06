import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createPaymentMethodService } from "../services/payment_method.create.service.js";

export const createPaymentMethod = asyncHandler(async (req, res) => {
    const data = await createPaymentMethodService(req.body);
    res.status(201).json({ message: "Tạo thành công", data });
});
