import axiosClient from "@/src/core/api/axios-instance";

export const updateAreaService = async (data: { id: string; payload: any }) => {
    return await axiosClient.put(`/restaurant-manager/area/${data.id}`, data.payload);
};
