import { prisma } from "../../../../databases/init.mongodb.js";
export const getCategoriesRestaurantRepository = {
    getCategories: async (where, skip, limit) => {
        return prisma.category_Restaurant.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                icon: true,
                isActive: true,
                bgColor: true,
                textColor: true,
                description: true,
            },
            orderBy: {
                id: "desc"
            }
        });
    },
    countCategories: async (where) => {
        return prisma.category_Restaurant.count({ where });
    }
};