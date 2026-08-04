import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { getOperatingHoursService } from "../../../brand_owner/operating_hours/services/operating_hours.get.service.js";
import { ForbiddenError } from "../../../../core/constants/error/index.js";

export const getOperatingHoursController = asyncHandler(async (req, res) => {
    // Trích xuất restaurantId trực tiếp từ req.user (được gán lúc login của Nhân viên)
    const restaurantId = req.user?.restaurantId || req.query.restaurantId || req.params.restaurantId;

    if (!restaurantId) {
        throw new ForbiddenError("Không tìm thấy thông tin chi nhánh của bạn");
    }

    const result = await getOperatingHoursService(restaurantId);

    return res.status(200).json({
        message: "Lấy cấu hình giờ hoạt động thành công",
        metadata: result
    });
});
