import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { createPaymentService } from "../services/brand_subscription.create_payment.service.js";

export const createPaymentController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { planId, systemPaymentMethodId } = req.body;

    const data = await createPaymentService(userId, planId, systemPaymentMethodId);

    return res.status(200).json({
        message: "Tạo thông tin thanh toán thành công",
        data
    });
});
