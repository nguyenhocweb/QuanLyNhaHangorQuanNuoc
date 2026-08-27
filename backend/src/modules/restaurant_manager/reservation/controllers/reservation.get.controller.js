import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getReservationsService, getReservationByIdService } from "../services/reservation.get.service.js";

export const getReservations = asyncHandler(async (req, res) => {
    const { restaurantId } = req.params;
    const filters = req.query;
    
    const result = await getReservationsService(restaurantId, filters);
    
    res.status(200).json({
        message: "Lấy danh sách đặt bàn thành công",
        metadata: result
    });
});

export const getReservationById = asyncHandler(async (req, res) => {
    const { restaurantId, id } = req.params;
    const result = await getReservationByIdService(id, restaurantId);
    
    res.status(200).json({
        message: "Lấy thông tin đặt bàn thành công",
        metadata: result
    });
});
