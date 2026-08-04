import axiosClient from "@/src/core/api/axios-instance";

export const deleteTableMaintenanceService = async (id: string): Promise<{ message: string }> => {
    return await axiosClient.delete(`/restaurant-manager/table-maintenance/${id}`);
};
