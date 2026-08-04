import axiosClient from "@/src/core/api/axios-instance";
import { Reservation } from "../type/reservation.type";
import { ReservationFormValues } from "../schema/reservation.schema";

export const updateReservationService = async (
    restaurantId: string,
    id: string,
    data: Partial<ReservationFormValues>
): Promise<{ message: string; metadata: Reservation }> => {
    const response = await axiosClient.put(`/restaurant-manager/reservation/${restaurantId}/${id}`, data);
    return response.data;
};
