import axiosClient from "@/src/core/api/axios-instance";
import { Brand } from "../../../system_admin/brands/brands_type/brand-type";

export const getPublicBrandByIdService = async (id: string) => {
    // Trả về data (bỏ qua bọc {code: 200, data} từ backend vì axiosClient trả về data trực tiếp theo config interceptor)
    const response = await axiosClient.get<{ code: number, data: Brand }>(`/brand/${id}`);
    return response.data; // trả về cục data chứa thông tin brand
};

export const getPublicBrandsService = async (page: number, limit: number, search?: string) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    if (search) {
        params.append("search", search);
    }
    const response = await axiosClient.get<{ data: { data: Brand[]; total: number } }>(`/brand?${params.toString()}`);
    return response.data;
};
