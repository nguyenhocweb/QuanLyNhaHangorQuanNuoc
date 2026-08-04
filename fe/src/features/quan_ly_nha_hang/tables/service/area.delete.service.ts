import axiosClient from "@/src/core/api/axios-instance";

export const deleteAreaService = async (id: string) => {
    return await axiosClient.delete(`/restaurant-manager/area/${id}`);
};
