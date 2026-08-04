import axiosClient from "@/src/core/api/axios-instance";

export const createTableService = async (payload: any) => {
    return await axiosClient.post(`/restaurant-manager/table`, payload);
};
