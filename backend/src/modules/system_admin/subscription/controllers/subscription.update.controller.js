import * as updateService from "../services/subscription.update.service.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";

export const updateSubscription = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await updateService.updateSubscription(id, req.body);
    res.status(200).json({
        message: "Cập nhật gói cước thành công",
        data: result
    });
});
