import { BadRequestError, NotFoundError } from "../../../../core/constants/error/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { updateCategoryRestaurantRepository } from "../repositories/updateCategory.repository.js";

export const updateCategoryRestaurantService = async (id, data) => {
    const existingCategory = await prisma.category_Restaurant.findUnique({
        where: { id }
    });

    if (!existingCategory) {
        throw new NotFoundError("Không tìm thấy loại hình nhà hàng");
    }

    if (data.name && data.name !== existingCategory.name) {
        const nameExists = await prisma.category_Restaurant.findUnique({
            where: { name: data.name }
        });
        if (nameExists) {
            throw new BadRequestError("Tên loại hình nhà hàng đã tồn tại");
        }
    }

    return await updateCategoryRestaurantRepository(id, data);
};
