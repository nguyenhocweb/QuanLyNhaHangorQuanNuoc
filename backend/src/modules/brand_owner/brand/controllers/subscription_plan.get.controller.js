import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { getSubscriptionPlansService } from "../services/subscription_plan.get.service.js";

export const getSubscriptionPlansController = asyncHandler(async (req, res) => {
    const data = await getSubscriptionPlansService();

    return res.status(200).json({
        message: "Lấy danh sách gói cước thành công",
        data
    });
});
