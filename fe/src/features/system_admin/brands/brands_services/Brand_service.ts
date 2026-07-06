import axiosClient from "@/src/core/api/axios-instance";
import { Brand } from "../brands_type/brand-type";
export const BrandService=async(id:string)=>{
    const response=await axiosClient.get<Brand>(`/system-admin/brand/${id}`)   ;     
    return response.data ;
}

export const getBrandsService = async (page: number, limit: number, search?: string) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    if (search) {
        params.append("search", search);
    }
    const response = await axiosClient.get<{ data: Brand[]; total: number }>(`/system-admin/brand?${params.toString()}`);
    return response.data;
};

export const updateBrandService = async (id: string, payload: any) => {
    const response = await axiosClient.put<{ message: string, id: string }>(`/system-admin/brand/${id}`, payload);
    return response.data;
};

export const deleteBrandService = async (id: string) => {
    const response = await axiosClient.delete<{ message: string, id: string }>(`/system-admin/brand/${id}`);
    return response.data;
};