import { getPublicRestaurantCoreInfoRepo } from "../repositories/restaurant.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getPublicRestaurantService = async (id) => {
    const restaurant = await getPublicRestaurantCoreInfoRepo(id);

    if (!restaurant) {
        throw new NotFoundError("Không tìm thấy nhà hàng hoặc nhà hàng đã tạm ngưng hoạt động.");
    }

    // Format keys for frontend compatibility
    const formattedRestaurant = {
        ...restaurant,
        averageRating: restaurant.ratingStats?.averageRating || 0,
        totalRating: restaurant.ratingStats?.totalRating || 0,
        maxPartySize: restaurant.bookingConfig?.maxPartySize || null,
        bookingWindowDays: restaurant.bookingConfig?.bookingWindowDays || null,
        cancellationHours: restaurant.bookingConfig?.cancellationHours || null,
        depositRequired: restaurant.bookingConfig?.depositRequired || false,
        depositPerPax: restaurant.bookingConfig?.depositAmount || null,
        phoneContact: restaurant.phone_contact,
        emailContact: restaurant.email_contact,
        categories: restaurant.categoryRestaurants,
        amenities: restaurant.restaurantAmenities,
        social_links: [],
        delivery_partners: [],
        faqs: []
    };
    delete formattedRestaurant.ratingStats;
    delete formattedRestaurant.bookingConfig;
    delete formattedRestaurant.categoryRestaurants;
    delete formattedRestaurant.restaurantAmenities;
    delete formattedRestaurant.phone_contact;
    delete formattedRestaurant.email_contact;

    return {
        message: "Lấy thông tin nhà hàng thành công",
        metadata: formattedRestaurant,
    };
};
