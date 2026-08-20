import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { createReservationService } from "../services/reservation.create.service.js";

export const createReservation = asyncHandler(async (req, res) => {
    const { restaurantId } = req.params;
    const staffId = req.user.id;
    
    const result = await createReservationService(restaurantId, staffId, req.body);
    
    res.status(201).json({
        message: "Tạo đặt bàn thành công",
        metadata: result
    });
});
