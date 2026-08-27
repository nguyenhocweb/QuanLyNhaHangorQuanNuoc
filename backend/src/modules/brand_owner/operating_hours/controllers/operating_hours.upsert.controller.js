import { upsertOperatingHoursService } from "../services/operating_hours.upsert.service.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";

export const upsertOperatingHoursController = {
    upsert: asyncHandler(async (req, res) => {
        const { idRestaurant } = req.params;
        const { operating_hours } = req.body;
        const result = await upsertOperatingHoursService(idRestaurant, operating_hours);
        return res.status(200).json({
            message: "Cập nhật giờ hoạt động thành công",
            metadata: result
        });
    })
};
