import { BadRequestError } from "../../../../core/constants/error/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { createCategoryRestaurantRepository } from "../repositories/createCategory.repository.js";

export const createCategoryRestaurantService = async (data) => {
    const existingCategory = await prisma.category_Restaurant.findUnique({
        where: { name: data.name }
    });

    if (existingCategory) {
        throw new BadRequestError("Tên loại hình nhà hàng đã tồn tại");
    }

    return await createCategoryRestaurantRepository(data);
};
