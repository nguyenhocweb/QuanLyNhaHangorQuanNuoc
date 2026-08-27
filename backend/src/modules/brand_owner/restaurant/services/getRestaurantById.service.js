import { getRestaurantByIdRepo } from "../repositories/restaurant.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getRestaurantByIdService = async (brandId, restaurantId) => {
    if (!brandId) throw new NotFoundError("Không tìm thấy thông tin Brand của bạn");
    if (!restaurantId) throw new NotFoundError("Vui lòng cung cấp ID nhà hàng");
    
    const restaurant = await getRestaurantByIdRepo({
        id: restaurantId,
        brandId: brandId
    });

    if (!restaurant) throw new NotFoundError("Không tìm thấy nhà hàng hoặc nhà hàng không thuộc thương hiệu này");

    // Format for frontend compatibility
    if (restaurant.categoryRestaurants) {
        restaurant.categories = restaurant.categoryRestaurants;
        delete restaurant.categoryRestaurants;
    }
    if (restaurant.restaurantAmenities) {
        restaurant.amenities = restaurant.restaurantAmenities;
        delete restaurant.restaurantAmenities;
    }
    if (restaurant.email_contact !== undefined) {
        restaurant.emailContact = restaurant.email_contact;
        delete restaurant.email_contact;
    }
    if (restaurant.phone_contact !== undefined) {
        restaurant.phoneContact = restaurant.phone_contact;
        delete restaurant.phone_contact;
    }
    // Handle bad data where address was accidentally saved as { set: { ... } }
    if (restaurant.address && restaurant.address.set) {
        restaurant.address = restaurant.address.set;
    }

    // Flatten booking config for frontend compatibility
    if (restaurant.bookingConfig) {
        restaurant.maxPartySize = restaurant.bookingConfig.maxPartySize;
        restaurant.bookingWindowDays = restaurant.bookingConfig.bookingWindowDays;
        restaurant.cancellationHours = restaurant.bookingConfig.cancellationHours;
        restaurant.depositRequired = restaurant.bookingConfig.depositRequired;
        restaurant.depositPerPax = restaurant.bookingConfig.depositAmount;
        delete restaurant.bookingConfig;
    }

    // Flatten rating stats
    if (restaurant.ratingStats) {
        restaurant.totalRating = restaurant.ratingStats.totalRating;
        restaurant.averageRating = restaurant.ratingStats.averageRating;
        restaurant.average_food_rating = restaurant.ratingStats.food;
        restaurant.average_service_rating = restaurant.ratingStats.service;
        restaurant.average_ambiance_rating = restaurant.ratingStats.ambiance;
        delete restaurant.ratingStats;
    }

    return restaurant;
};
