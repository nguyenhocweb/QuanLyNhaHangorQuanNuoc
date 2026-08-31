import { prisma } from "../../../../databases/init.mongodb.js";

export const getPublicRestaurantCoreInfoRepo = async (id) => {
    return prisma.restaurant.findFirst({
        where: {
            id,
            statusByAdmin: "ACTIVE",
            statusByBrand: "ACTIVE", // Chỉ hiển thị các nhà hàng đang hoạt động
        },
        select: {
            id: true,
            name: true,
            logo: true,
            imageMain: true,
            images: true,
            phone_contact: true,
            email_contact: true,
            address: true,
            description: true,
            ratingStats: {
                select: {
                    averageRating: true,
                    totalRating: true,
                }
            },
            bookingConfig: {
                select: {
                    maxPartySize: true,
                    bookingWindowDays: true,
                    cancellationHours: true,
                    depositRequired: true,
                    depositAmount: true,
                }
            },
            brand: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                }
            },
            template: {
                select: {
                    code: true,
                    type: true,
                }
            },
            categoryRestaurants: {
                select: {
                    id: true,
                    name: true,
                    bgColor: true,
                    textColor: true,
                }
            },
            tags: {
                select: {
                    id: true,
                    name: true,
                    textColor: true,
                    bgColor: true,
                }
            },
            restaurantAmenities: {
                select: {
                    id: true,
                    name: true,
                    icon: true,
                }
            }
        }
    });
};
