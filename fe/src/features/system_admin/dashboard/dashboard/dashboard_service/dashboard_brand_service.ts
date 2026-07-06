import axiosClient from "@/src/core/api/axios-instance";
import { getDashboardBrands_Reponse } from "../dashboard_type/dashboard_brand_type";

export const DashboardBrandService = async (limit: number = 5): Promise<getDashboardBrands_Reponse[]> => {
    const res = await axiosClient.get<getDashboardBrands_Reponse[]>(`/system-admin/dashboard/brands?limit=${limit}`);
    return res.data;
};
