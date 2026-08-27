import { prisma } from "../../../../databases/init.mongodb.js";

export const getRestaurants = async (where, skip, limit) => {
    return prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        select: {
            id: true,
            name: true,
            logo: true,
            imageMain: true,
            images: true,
            description: true,
            address: true,
            email_contact: true,
            phone_contact: true,
            statusByAdmin: true,
            reasonByAdmin: true,
            statusByBrand: true,
            reasonByBrand: true,
            ratingStats: true,
            bookingConfig: true,
            createdAt: true,
            brandId: true,
            brand: {
                select: {
                    id: true,
                    name: true
                }
            },
            categoryRestaurantIds: true,
            categoryRestaurants: {
                select: {
                    id: true,
                    name: true,
                    bgColor: true,
                    textColor: true,
                }
            },
            employments: {
                where: {
                    workspaceRole: {
                        name: 'Quản lý nhà hàng'
                    }
                },
                select: {
                    user: {
                        select: {
                            name: true,
                            avatar: true
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });
};

export const getRestaurantById = async (id) => {
    return prisma.restaurant.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            logo: true,
            imageMain: true,
            images: true,
            description: true,
            address: true,
            email_contact: true,
            phone_contact: true,
            statusByAdmin: true,
            reasonByAdmin: true,
            statusByBrand: true,
            reasonByBrand: true,
            ratingStats: true,
            bookingConfig: true,
            taxConfig: true,
            createdAt: true,
            brandId: true,
            brand: {
                select: {
                    id: true,
                    name: true
                }
            },
            categoryRestaurantIds: true,
            categoryRestaurants: {
                select: {
                    id: true,
                    name: true,
                    bgColor: true,
                    textColor: true,
                }
            }
        }
    });
};

export const countRestaurants = async (where) => {
    return prisma.restaurant.count({ where });
};
