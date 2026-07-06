import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updatePaymentMethodService } from "../services/payment_method.update.service.js";

export const updatePaymentMethod = asyncHandler(async (req, res) => {
    const data = await updatePaymentMethodService(req.params.id, req.body);
    res.status(200).json({ message: "Cập nhật thành công", data });
});
