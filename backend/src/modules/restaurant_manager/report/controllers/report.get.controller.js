import { getReportService } from "../services/report.get.service.js";

export const getReport = async (req, res) => {
    // We expect restaurantId in query or params. Let's use req.user.restaurantId if it's RM, but currently we might pass it in query.
    // Let's use query for flexibility.
    const restaurantId = req.query.restaurantId;
    if (!restaurantId) {
        return res.status(400).json({ message: "restaurantId is required" });
    }
    
    const data = await getReportService(restaurantId, req.query);

    return res.status(200).json({
        message: "Lấy báo cáo doanh thu chi nhánh thành công",
        metadata: data
    });
};
