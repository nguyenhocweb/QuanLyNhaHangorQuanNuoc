import axiosClient from "@/src/core/api/axios-instance";
import { FindUserBrandOwnerReponse } from "../type/FindUserBrandOwner_type";

export const FindUsersBrandOwnerService = async (
    search?: string,
): Promise<FindUserBrandOwnerReponse[]> => {
    const params = new URLSearchParams();

    if (search) params.append("search", search);


    const response = await axiosClient.get<FindUserBrandOwnerReponse[]>(`/users/brandOwner?${params.toString()}`);
    return response.data;
};
