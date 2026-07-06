import axiosClient from "@/src/core/api/axios-instance";
import { Brand } from "../brands_type/brand-type";

export const getBrandByIdService = async (id: string): Promise<Brand> => {
    const response = await axiosClient.get(`/system-admin/brand/${id}`);
    return response.data;
};
