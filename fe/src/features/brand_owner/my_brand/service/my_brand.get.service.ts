import axiosClient from "@/src/core/api/axios-instance";
import { Brand } from "@/src/features/system_admin/brands/brands_type/brand-type";

export const getMyBrandService = async () => {
    return await axiosClient.get<{ message: string; data: Brand }>("/brand-owner/brand");
};
