import { cancelReservationService } from "../reservation.service/CancelReservation.service.js";

export const cancelReservationController = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { reason } = req.body;

    const result = await cancelReservationService(id, userId, reason || "Khách hàng tự hủy trên ứng dụng");

    res.status(200).json({
        message: "Hủy đặt bàn thành công",
        metadata: result
    });
};
