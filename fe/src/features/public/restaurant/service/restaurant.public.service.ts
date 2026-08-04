import axiosClient from "@/src/core/api/axios-instance";
import { IPublicRestaurantCore, IOperatingHour, IPublicMenu, IPublicReview } from "../type/restaurant.public.type";

export const getPublicRestaurantCoreService = async (id: string): Promise<{ metadata: IPublicRestaurantCore }> => {
    const res = await axiosClient.get(`/restaurant/v2/${id}`);
    return res.data;
};

export const getPublicRestaurantHoursService = async (id: string): Promise<{ metadata: { operating_hours: IOperatingHour[], special_schedules: any[] } }> => {
    const res = await axiosClient.get(`/restaurant/v2/${id}/operating-hours`);
    return res.data;
};

export const getPublicRestaurantMenuService = async (id: string): Promise<{ metadata: IPublicMenu[] }> => {
    const res = await axiosClient.get(`/restaurant/v2/${id}/menu`);
    return res.data;
};

export const getPublicRestaurantReviewsService = async (id: string, page: number = 1, limit: number = 10, rating?: number | null, sortBy?: string, hasImage?: boolean): Promise<{ metadata: { reviews: IPublicReview[], pagination: any } }> => {
    const params: any = { page, limit };
    if (rating) params.rating = rating;
    if (sortBy) params.sortBy = sortBy;
    if (hasImage) params.hasImage = hasImage;
    
    const res = await axiosClient.get(`/restaurant/v2/${id}/reviews`, { params });
    return res.data;
};
