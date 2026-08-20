import { createRestaurant } from "../repositories/restaurant.create.repo.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { ForbiddenError, NotFoundError } from "../../../../core/constants/error/index.js";

export const createRestaurantService = async (data) => {
    if (data.brandId) {
        const brand = await prisma.brand.findUnique({
            where: { id: data.brandId },
            include: {
                subscriptions: {
                    where: { status: 'ACTIVE' },
                    include: { plan: true }
                },
                _count: {
                    select: { restaurants: true }
                }
            }
        });

        if (!brand) {
            throw new NotFoundError("Thương hiệu không tồn tại");
        }

        const activeSubscription = brand.subscriptions[0];
        if (!activeSubscription) {
            throw new ForbiddenError("Thương hiệu chưa có gói cước đang hoạt động. Vui lòng đăng ký gói cước để tạo nhà hàng.");
        }

        const maxRestaurants = activeSubscription.plan.maxRestaurants;
        const currentRestaurantsCount = brand._count.restaurants;

        if (maxRestaurants !== -1 && currentRestaurantsCount >= maxRestaurants) {
            throw new ForbiddenError(`Vượt quá số lượng nhà hàng tối đa của gói cước (${maxRestaurants} nhà hàng). Vui lòng nâng cấp gói cước để tạo thêm.`);
        }
    }

    const { brandId, categoryIds, isActive, ...restData } = data;

    const payload = {
        ...restData,
        imageMain: restData.imageMain || "default.png",
        maxPartySize: restData.maxPartySize ? parseInt(restData.maxPartySize) : 50,
        bookingWindowDays: restData.bookingWindowDays ? parseInt(restData.bookingWindowDays) : 7,
        cancellationHours: restData.cancellationHours ? parseInt(restData.cancellationHours) : 24,
        weightedScore: restData.weightedScore ? parseFloat(restData.weightedScore) : 0,
        totalRating: restData.totalRating ? parseInt(restData.totalRating) : 0,
        averageRating: restData.averageRating ? parseFloat(restData.averageRating) : 0.0,
        statusByAdmin: "ACTIVE",
        statusByBrand: "ACTIVE",
    };

    if (brandId) {
        payload.brand = { connect: { id: brandId } };
    }

    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
        payload.categories = {
            connect: categoryIds.map(id => ({ id }))
        };
    }

    return await createRestaurant(payload);
};
