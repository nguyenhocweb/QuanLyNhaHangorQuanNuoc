import { getRestaurantsRepo } from "../repositories/restaurant.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getRestaurantsService = async (brandId) => {
    if (!brandId) throw new NotFoundError("Không tìm thấy thông tin Brand của bạn");
    
    const restaurants = await getRestaurantsRepo({
        brandId: brandId
    });

    // Format for frontend compatibility
    return restaurants.map(r => {
        if (r.categoryRestaurants) {
            r.categories = r.categoryRestaurants;
            delete r.categoryRestaurants;
        }
        if (r.restaurantAmenities) {
            r.amenities = r.restaurantAmenities;
            delete r.restaurantAmenities;
        }
        if (r.email_contact !== undefined) {
            r.emailContact = r.email_contact;
            delete r.email_contact;
        }
        if (r.phone_contact !== undefined) {
            r.phoneContact = r.phone_contact;
            delete r.phone_contact;
        }
        if (r.address && r.address.set) {
            r.address = r.address.set;
        }

        // Flatten booking config for frontend compatibility
        if (r.bookingConfig) {
            r.maxPartySize = r.bookingConfig.maxPartySize;
            r.bookingWindowDays = r.bookingConfig.bookingWindowDays;
            r.cancellationHours = r.bookingConfig.cancellationHours;
            r.depositRequired = r.bookingConfig.depositRequired;
            r.depositPerPax = r.bookingConfig.depositAmount;
            delete r.bookingConfig;
        }

        // Flatten rating stats
        if (r.ratingStats) {
            r.totalRating = r.ratingStats.totalRating;
            r.averageRating = r.ratingStats.averageRating;
            r.average_food_rating = r.ratingStats.food;
            r.average_service_rating = r.ratingStats.service;
            r.average_ambiance_rating = r.ratingStats.ambiance;
            delete r.ratingStats;
        }

        return r;
    });
};
