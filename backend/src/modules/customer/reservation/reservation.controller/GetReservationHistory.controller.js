import { getReservationHistoryService } from "../reservation.service/GetReservationHistory.service.js";

export const getReservationHistoryController = async (req, res) => {
    // req.user được gán từ middleware authenticateToken
    const userId = req.user.id;
    const query = req.query;

    const result = await getReservationHistoryService(userId, query);

    res.status(200).json({
        message: "Lấy danh sách lịch sử đặt bàn thành công",
        metadata: result
    });
};
