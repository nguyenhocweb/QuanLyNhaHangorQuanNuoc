import { getOperatingHoursService } from "../services/operating_hours.get.service.js";
import { asyncHandler } from "../../../../core/utils/asyncHandler.js";

export const getOperatingHoursController = {
    get: asyncHandler(async (req, res) => {
        const { idRestaurant } = req.params;
        const result = await getOperatingHoursService(idRestaurant);
        return res.status(200).json({
            message: "Lấy thông tin giờ hoạt động thành công",
            metadata: result
        });
    })
};
