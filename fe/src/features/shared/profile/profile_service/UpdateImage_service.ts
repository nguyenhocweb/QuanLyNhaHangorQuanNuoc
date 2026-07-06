import axiosClient from "@/src/core/api/axios-instance";
import { UpdateImageProfle_Requet } from "../profile_type/UpdateIamge_type";
export const UpdateImageService = async ({ urlAvatar, id }:UpdateImageProfle_Requet): Promise<{ avatar: string }> => {
    
    const response = await axiosClient.patch<{ avatar: string }>(`/users/avatar`, {urlAvatar,id});
    return response.data;
}