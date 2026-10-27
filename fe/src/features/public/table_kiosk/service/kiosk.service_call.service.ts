import axiosClient from "@/src/core/api/axios-instance";

export interface CreateServiceCallPayload {
    restaurantId: string;
    tableId: string;
    type: "CALL_STAFF" | "WATER" | "ICE" | "BILL_CASH" | "CLEAN_TABLE" | "OTHER";
    note?: string;
}

export const createServiceCallService = async (payload: CreateServiceCallPayload): Promise<{ message: string; metadata: any }> => {
    const res = await axiosClient.post(`/public/table-kiosk/service-call`, payload);
    return res.data;
};
