import * as getService from "../services/subscription.get.service.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";

export const getFeatures = asyncHandler(async (req, res) => {
    const features = await getService.getSubscriptionFeatures();
    res.status(200).json({
        message: "Lấy danh sách tính năng thành công",
        data: features
    });
});

export const getSubscriptions = asyncHandler(async (req, res) => {
    const result = await getService.getSubscriptions(req.query);
    res.status(200).json({
        message: "Lấy danh sách gói cước thành công",
        ...result
    });
});
