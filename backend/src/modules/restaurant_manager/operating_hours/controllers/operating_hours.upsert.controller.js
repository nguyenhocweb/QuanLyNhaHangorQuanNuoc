import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { upsertOperatingHoursService } from "../../../brand_owner/operating_hours/services/operating_hours.upsert.service.js";
import { ForbiddenError } from "../../../../core/constants/error/index.js";

export const upsertOperatingHoursController = asyncHandler(async (req, res) => {
    // Trích xuất restaurantId trực tiếp từ req.user (được gán lúc login của Nhân viên)
    const restaurantId = req.user?.restaurantId || req.query.restaurantId || req.params.restaurantId;

    if (!restaurantId) {
        throw new ForbiddenError("Không tìm thấy thông tin chi nhánh của bạn");
    }

    const { operating_hours: operatingHours } = req.body;
    const result = await upsertOperatingHoursService(restaurantId, operatingHours);

    return res.status(200).json({
        message: "Cập nhật giờ hoạt động thành công",
        metadata: result
    });
});
