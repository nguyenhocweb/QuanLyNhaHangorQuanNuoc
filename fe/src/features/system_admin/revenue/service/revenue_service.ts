import axiosClient from "../../../../core/api/axios-instance";
import { AdminRevenueRecord, AdminRevenueResponse } from "../type/revenue.type";

export const getRevenueListService = async (params: { month?: number | null; year?: number | null; page?: number; limit?: number; planName?: string; status?: string; search?: string }): Promise<AdminRevenueResponse> => {
    const res = await axiosClient.get("/system-admin/subscription/revenue", { params });
    return res.data;
};
