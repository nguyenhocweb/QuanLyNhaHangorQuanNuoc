import axiosClient from "@/src/core/api/axios-instance";
import { ReportResponse } from "../type/report.type";

export const getReportService = async (brandId: string, params?: { startDate?: string; endDate?: string }): Promise<ReportResponse> => {
    const { data } = await axiosClient.get(`/brand-owner/${brandId}/report`, { params });
    return data.metadata;
};
