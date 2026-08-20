import { NotFoundError } from "../../../../core/constants/error/index.js";
import { getCategoriesRestaurantRepository } from "../repositories/getCategory.repository.js";
export const getCategoriesRestaurantService = async ({ page, limit, search, status }) => {
    const skip = (page - 1) * limit;
    
    const where = {};
    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }
    if (status !== 'all') {
        where.isActive = status === 'true';
    }

    const [data, totalRecords, totalActive, totalInactive] = await Promise.all([
        getCategoriesRestaurantRepository.getCategories(where, skip, limit),
        getCategoriesRestaurantRepository.countCategories(where),
        getCategoriesRestaurantRepository.countCategories({ isActive: true }),
        getCategoriesRestaurantRepository.countCategories({ isActive: false })
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
        data,
        meta: {
            totalRecords,
            totalActive,
            totalInactive,
            totalPages,
            currentPage: page,
            limit
        }
    };
};