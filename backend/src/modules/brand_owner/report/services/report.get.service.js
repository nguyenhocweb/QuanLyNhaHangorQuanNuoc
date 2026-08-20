import { getRevenueReport } from "../repositories/report.get.repo.js";

export const getReportService = async (brandId, query) => {
    const { startDate, endDate } = query;
    return await getRevenueReport(brandId, startDate, endDate);
};
