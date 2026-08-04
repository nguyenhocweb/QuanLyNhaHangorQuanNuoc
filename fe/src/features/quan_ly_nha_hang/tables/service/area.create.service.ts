import axiosClient from "@/src/core/api/axios-instance";

export const createAreaService = async (payload: any) => {
    return await axiosClient.post(`/restaurant-manager/area`, payload);
};
