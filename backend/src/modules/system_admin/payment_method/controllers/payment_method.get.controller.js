import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getPaymentMethodsService, getPaymentMethodByIdService } from "../services/payment_method.get.service.js";

export const getPaymentMethods = asyncHandler(async (req, res) => {
    const data = await getPaymentMethodsService();
    res.status(200).json({ message: "Lấy danh sách thành công", data });
});

export const getPaymentMethodById = asyncHandler(async (req, res) => {
    const data = await getPaymentMethodByIdService(req.params.id);
    res.status(200).json({ message: "Lấy chi tiết thành công", data });
});
