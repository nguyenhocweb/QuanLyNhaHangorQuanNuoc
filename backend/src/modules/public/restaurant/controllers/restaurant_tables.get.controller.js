import { getAvailableTablesService } from "../services/restaurant_tables.get.service.js";

export const getAvailableTablesController = async (req, res) => {
    const { id } = req.params;
    const { date, startTime, endTime, partySize } = req.query;

    const metadata = await getAvailableTablesService(id, { date, startTime, endTime, partySize });
    
    return res.status(200).json({
        message: "Lấy danh sách bàn trống thành công",
        metadata
    });
};
