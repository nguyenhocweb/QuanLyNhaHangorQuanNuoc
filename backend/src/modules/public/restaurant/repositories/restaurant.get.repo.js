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
            phoneContact: true,
            emailContact: true,
            address: true,
            description: true,
            averageRating: true,
            totalRating: true,
            policies: true,
            socialLinks: true,
            faqs: true,
            deliveryPartners: true,
            maxPartySize: true,
            bookingWindowDays: true,
            cancellationHours: true,
            depositRequired: true,
            depositPerPax: true,
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
            categories: {
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
            amenities: {
                select: {
                    id: true,
                    name: true,
                    icon: true,
                }
            }
        }
    });
};
