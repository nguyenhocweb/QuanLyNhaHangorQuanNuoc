import axiosClient from "@/src/core/api/axios-instance";
import { Reservation, ReservationStatus } from "../type/reservation.type";

export const updateReservationStatusService = async (
    restaurantId: string,
    id: string,
    status: ReservationStatus,
    cancellation_reason?: string
): Promise<{ message: string; metadata: Reservation }> => {
    const response = await axiosClient.patch(`/restaurant-manager/reservation/${restaurantId}/${id}/status`, { status, cancellation_reason });
    return response.data;
};
