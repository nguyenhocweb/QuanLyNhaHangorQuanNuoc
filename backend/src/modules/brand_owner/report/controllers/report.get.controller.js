import { getReportService } from "../services/report.get.service.js";

export const getReport = async (req, res) => {
    const brandId = req.params.id_brand;
    const query = req.query;

    const data = await getReportService(brandId, query);

    return res.status(200).json({
        message: "Lấy báo cáo doanh thu thành công",
        metadata: data
    });
};
