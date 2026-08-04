import axiosClient from "@/src/core/api/axios-instance";

export const updateTableService = async (data: { id: string; payload: any }) => {
    return await axiosClient.put(`/restaurant-manager/table/${data.id}`, data.payload);
};
