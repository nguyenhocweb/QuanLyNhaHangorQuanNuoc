import axiosClient from "@/src/core/api/axios-instance";
import { RegisterFormValues, RegisterResponse } from "../auth_types/register_type";

export const registerService = async (payload: RegisterFormValues): Promise<RegisterResponse> => {
    const response = await axiosClient.post<RegisterResponse>("/auth/register", payload);
    return response.data;
};
