import axiosClient from "@/src/core/api/axios-instance";
export type HoldTableResponse = {
    tableId: string;
    status: string;
    message?: string;
    timeRemaining?: number;
    heldBy?: string;
    expiresIn?: number;
};

export const holdTableService = async (tableId: string): Promise<{ message: string, metadata: HoldTableResponse }> => {
    const response = await axiosClient.post(`/restaurant-manager/table/${tableId}/hold`);
    return response.data;
};
