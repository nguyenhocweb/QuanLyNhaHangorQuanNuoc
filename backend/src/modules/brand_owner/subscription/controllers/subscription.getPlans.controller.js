import { getPlansService } from "../services/subscription.getPlans.service.js";

export const getActivePlans = async (req, res) => {
    const plans = await getPlansService.getActivePlans();
    return res.status(200).json({
        message: "Lấy danh sách gói cước thành công",
        metadata: plans
    });
};
