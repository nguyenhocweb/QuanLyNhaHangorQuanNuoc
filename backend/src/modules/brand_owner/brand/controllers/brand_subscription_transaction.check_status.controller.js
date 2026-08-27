import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { checkPaymentStatusService } from "../services/brand_subscription_transaction.check_status.service.js";

export const checkPaymentStatusController = asyncHandler(async (req, res) => {
    const { transactionId } = req.params;

    const data = await checkPaymentStatusService(transactionId);

    return res.status(200).json({
        message: "Lấy trạng thái thanh toán thành công",
        data
    });
});
