import axiosClient from "@/src/core/api/axios-instance";
import { Dashboard_stat_response } from "../dashboard_type/Dashboard_stat_type";

export const DashboardStatService = async (): Promise<Dashboard_stat_response> => {
    const res = await axiosClient.get<Dashboard_stat_response>("/system-admin/dashboard");
    return res.data;
}