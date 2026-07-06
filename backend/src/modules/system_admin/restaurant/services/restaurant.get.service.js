import { NotFoundError } from "../../../../core/constants/error/index.js";
import { getRestaurants, countRestaurants, getRestaurantById } from "../repositories/restaurant.get.repo.js";

export const getRestaurantsService = async ({ page, limit, search, status, city, rating, categoryId }) => {
    const skip = (page - 1) * limit;
    
    const where = {};
    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }
    if (status !== 'all') {
        where.isActive = status === 'true' ? 'ACTIVE' : 'INACTIVE';
    }
    if (city) {
        where.address = { is: { province: city } };
    }
    if (rating) {
        where.averageRating = { gte: parseFloat(rating) };
    }
    if (categoryId) {
        where.categoryIds = { has: categoryId };
    }

    const [data, totalRecords, totalActive, totalInactive, totalNew] = await Promise.all([
        getRestaurants(where, skip, limit),
        countRestaurants(where),
        countRestaurants({ isActive: 'ACTIVE' }),
        countRestaurants({ isActive: 'INACTIVE' }),
        countRestaurants({ isNew: true })
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
        data,
        meta: {
            totalRecords,
            totalActive,
            totalInactive,
            totalNew,
            totalPages,
            currentPage: page,
            limit
        }
    };
};

export const getRestaurantByIdService = async (id) => {
    const data = await getRestaurantById(id);
    if (!data) throw new NotFoundError("Không tìm thấy nhà hàng");
    return data;
};
