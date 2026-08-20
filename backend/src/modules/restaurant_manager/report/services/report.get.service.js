import { getRevenueReport } from "../repositories/report.get.repo.js";

export const getReportService = async (restaurantId, query) => {
    // We could add more validation here if needed
    return await getRevenueReport(restaurantId, query.startDate, query.endDate);
};
