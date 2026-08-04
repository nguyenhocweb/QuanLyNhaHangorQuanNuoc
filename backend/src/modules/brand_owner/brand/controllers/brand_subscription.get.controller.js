import { getBrandSubscriptionService } from "../services/brand_subscription.get.service.js";

export const getBrandSubscriptionController = async (req, res) => {
    const userId = req.user.id;
    const subscription = await getBrandSubscriptionService(userId);
    
    return res.status(200).json({
        message: "Lấy thông tin gói cước thành công",
        data: subscription
    });
};
