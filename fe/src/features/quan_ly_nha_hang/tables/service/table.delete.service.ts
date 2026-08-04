import axiosClient from "@/src/core/api/axios-instance";

export const deleteTableService = async (id: string) => {
    return await axiosClient.delete(`/restaurant-manager/table/${id}`);
};
