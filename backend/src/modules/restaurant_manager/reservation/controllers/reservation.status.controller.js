import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateReservationStatusService } from "../services/reservation.status.service.js";

export const updateReservationStatus = asyncHandler(async (req, res) => {
    const { restaurantId, id } = req.params;
    const staffId = req.user.id;
    const { status, cancellation_reason } = req.body;
    
    const result = await updateReservationStatusService(id, restaurantId, status, staffId, cancellation_reason);
    
    res.status(200).json({
        message: "Cập nhật trạng thái thành công",
        metadata: result
    });
});
