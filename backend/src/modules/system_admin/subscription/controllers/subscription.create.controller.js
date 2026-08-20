import * as createService from "../services/subscription.create.service.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";

export const createSubscription = asyncHandler(async (req, res) => {
    const result = await createService.createSubscription(req.body);
    res.status(201).json({
        message: "Tạo gói cước thành công",
        data: result
    });
});
