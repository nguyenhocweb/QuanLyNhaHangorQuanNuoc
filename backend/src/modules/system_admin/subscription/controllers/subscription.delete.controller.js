import * as deleteService from "../services/subscription.delete.service.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";

export const deleteSubscription = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await deleteService.deleteSubscription(id);
    res.status(200).json({
        message: "Xóa gói cước thành công"
    });
});
