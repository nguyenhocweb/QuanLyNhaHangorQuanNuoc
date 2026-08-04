import { useMutation } from '@tanstack/react-query';
import axiosClient from '@/src/core/api/axios-instance';
import { AreaType } from '../../tables/type/table.type';

interface CheckAvailabilityPayload {
    reservation_date: string; // YYYY-MM-DD
    start_time: string; // HH:mm
    end_time?: string; // HH:mm
    party_size?: number;
}

interface CheckAvailabilityResponse {
    message: string;
    metadata: AreaType[];
}

export const useCheckTableAvailability = (restaurantId: string) => {
    return useMutation<CheckAvailabilityResponse, Error, CheckAvailabilityPayload>({
        mutationFn: async (payload: CheckAvailabilityPayload) => {
            const { data } = await axiosClient.post<CheckAvailabilityResponse>(
                `/restaurant-manager/table/${restaurantId}/availability`,
                payload
            );
            return data;
        },
    });
};
