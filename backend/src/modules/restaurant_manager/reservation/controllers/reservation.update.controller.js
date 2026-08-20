import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { updateReservationService } from "../services/reservation.update.service.js";

export const updateReservation = asyncHandler(async (req, res) => {
    const { restaurantId, id } = req.params;
    const staffId = req.user.id;
    
    const result = await updateReservationService(id, restaurantId, staffId, req.body);
    
    res.status(200).json({
        message: "Cập nhật thông tin đặt bàn thành công",
        metadata: result
    });
});
