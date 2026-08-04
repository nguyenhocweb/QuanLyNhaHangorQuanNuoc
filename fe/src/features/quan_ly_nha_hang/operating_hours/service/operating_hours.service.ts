import axiosClient from "@/src/core/api/axios-instance";
import { IOperatingHour } from "@/src/features/brand_owner/operating_hours/type/operating_hours.type";

export const getManagerOperatingHoursService = async (restaurantId: string): Promise<{ message: string, metadata: IOperatingHour[] }> => {
    const res = await axiosClient.get(`/restaurant-manager/operating-hours`, { params: { restaurantId } });
    return res.data;
};

export const upsertManagerOperatingHoursService = async (restaurantId: string, operatingHours: IOperatingHour[]): Promise<{ message: string, metadata: any }> => {
    const res = await axiosClient.put(`/restaurant-manager/operating-hours`, { operating_hours: operatingHours }, { params: { restaurantId } });
    return res.data;
};
