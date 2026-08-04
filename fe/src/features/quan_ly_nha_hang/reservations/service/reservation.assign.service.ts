import axiosClient from "@/src/core/api/axios-instance";

export const assignTableService = async (
    restaurantId: string,
    id: string,
    tableId: string
): Promise<{ message: string; metadata: any }> => {
    const response = await axiosClient.post(`/restaurant-manager/reservation/${restaurantId}/${id}/assign`, { tableId });
    return response.data;
};

export const unassignTableService = async (
    restaurantId: string,
    id: string,
    tableId: string
): Promise<{ message: string; metadata: any }> => {
    const response = await axiosClient.delete(`/restaurant-manager/reservation/${restaurantId}/${id}/assign/${tableId}`);
    return response.data;
};
