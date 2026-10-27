import { getTableKioskSessionService } from "../services/session.get.service.js";

export const getTableKioskSession = async (req, res) => {
    const { restaurantId, tableId } = req.query;

    const result = await getTableKioskSessionService(restaurantId, tableId);

    return res.status(200).json({
        message: "Lấy thông tin phiên làm việc bàn thành công",
        metadata: result
    });
};
