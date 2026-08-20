import { getCategoriesRestaurantRepository } from "../../../system_admin/category/repositories/getCategory.repository.js";

export const getPublicCategoriesService = async () => {
    // Chỉ lấy category đang active, limit 1000 để get tất cả
    const where = { isActive: true };
    const data = await getCategoriesRestaurantRepository.getCategories(where, 0, 1000);
    
    return { data };
};
