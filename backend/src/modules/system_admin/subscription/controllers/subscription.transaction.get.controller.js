import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getTransactionService } from "../services/subscription.transaction.get.service.js";

export const getTransaction = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.params;
    const result = await getTransactionService(subscriptionId);
    res.status(200).json({
        message: "Lấy chi tiết giao dịch thành công",
        data: result
    });
});
