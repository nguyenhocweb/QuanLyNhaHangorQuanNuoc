import { InformationProfileForm } from "../profile_schemas/information_profile";
import axiosClient from "@/src/core/api/axios-instance";

export const updateProfileService = async (data: InformationProfileForm):Promise<InformationProfileForm> => {
    const response = await axiosClient.patch<InformationProfileForm>('/user/profile', data);
    return response.data;
} 