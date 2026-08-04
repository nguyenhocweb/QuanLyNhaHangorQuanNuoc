import axiosClient from "@/src/core/api/axios-instance";
import { Brand } from "@/src/features/system_admin/brands/brands_type/brand-type";

export const updateMyBrandService = async (payload: Partial<Brand>) => {
    return await axiosClient.put("/brand-owner/brand", payload);
};
