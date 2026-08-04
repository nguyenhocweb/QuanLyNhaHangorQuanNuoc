import axiosClient from "@/src/core/api/axios-instance";
import { CustomerReservation } from "../type/reservation.type";

export const cancelMyReservationService = async (data: { id: string; reason: string }): Promise<{ message: string, metadata: CustomerReservation }> => {
    const res = await axiosClient.patch(`/customer/reservation/${data.id}/cancel`, { reason: data.reason });
    return res.data;
};
