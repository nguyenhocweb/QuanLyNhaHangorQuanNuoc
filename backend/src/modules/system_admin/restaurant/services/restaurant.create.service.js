import { createRestaurant } from "../repositories/restaurant.create.repo.js";

export const createRestaurantService = async (data) => {
    const payload = {
        ...data,
        imageMain: data.imageMain || "default.png",
        max_party_size: data.max_party_size ? parseInt(data.max_party_size) : 50,
        booking_window_days: data.booking_window_days ? parseInt(data.booking_window_days) : 7,
        cancellation_hours: data.cancellation_hours ? parseInt(data.cancellation_hours) : 24,
        weightedScore: data.weightedScore ? parseFloat(data.weightedScore) : 0,
        totalRating: data.totalRating ? parseInt(data.totalRating) : 0,
        averageRating: data.averageRating ? parseFloat(data.averageRating) : 0.0,
        isActive: data.isActive !== undefined ? (data.isActive ? 'ACTIVE' : 'INACTIVE') : 'ACTIVE'
    };
    return await createRestaurant(payload);
};
