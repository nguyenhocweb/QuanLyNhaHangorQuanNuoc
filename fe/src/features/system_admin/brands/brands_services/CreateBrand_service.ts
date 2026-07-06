import axiosClient from "@/src/core/api/axios-instance";
import { CreateBrandRequest, CreateBrandResponse, UpdateBrandImageRequest } from "../brands_type/createBrandReponse_type";

export const createBrandBasicService = async (
    data: CreateBrandRequest
): Promise<CreateBrandResponse> => {
    const response = await axiosClient.post<CreateBrandResponse>("/system-admin/brand", data);
    return response.data;
};

export const updateBrandImagesService = async (
    id: string,
    data: UpdateBrandImageRequest
): Promise<string> => {
    const response = await axiosClient.patch<string>(`/system-admin/brand/${id}/images`, data);
    return response.data;
};

