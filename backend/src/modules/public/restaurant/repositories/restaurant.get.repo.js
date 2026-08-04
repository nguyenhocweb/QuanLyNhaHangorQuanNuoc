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
            averageRating: true,
            totalRating: true,
            policies: true,
            social_links: true,
            faqs: true,
            delivery_partners: true,
            max_party_size: true,
            booking_window_days: true,
            cancellation_hours: true,
            deposit_required: true,
            deposit_amount: true,
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
