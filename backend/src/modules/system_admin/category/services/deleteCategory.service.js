import { deleteCategoryRestaurantRepository } from "../repositories/deleteCategory.repository.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const deleteCategoryRestaurantService = async (id) => {
    try {
        const deletedCategory = await deleteCategoryRestaurantRepository(id);
        if (!deletedCategory) {
            throw new NotFoundError("Không tìm thấy danh mục để xóa");
        }
        return deletedCategory;
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError("Không tìm thấy danh mục để xóa");
        }
        throw error;
    }
};
