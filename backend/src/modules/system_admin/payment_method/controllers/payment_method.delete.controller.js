import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { deletePaymentMethodService } from "../services/payment_method.delete.service.js";

export const deletePaymentMethod = asyncHandler(async (req, res) => {
    const data = await deletePaymentMethodService(req.params.id);
    res.status(200).json({ message: "Xóa thành công", data });
});
