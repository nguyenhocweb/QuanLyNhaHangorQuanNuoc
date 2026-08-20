import { prisma } from "../../../../databases/init.mongodb.js";

export const createBrand = async (data) => {
    const brand = await prisma.brand.create({
        data,
        select: {
            id: true,
        },
    });

    return brand?.id || null;
};

export const updateBrandById = async (_id, data) => {
    try {
        await prisma.brand.update({
            where: { id: _id },
            data,
        });
        return true;
    } catch (error) {
        if (error?.code === "P2025") {
            return false;
        }
        throw error;
    }
};

export const countBrands = async (where) => {
    return prisma.brand.count({
        where: where
    });
}
const today = new Date();
const day = today.getDay();//lấy thứ trong tuần
export const getBrandById = async (_id) => {
    const brand = await prisma.brand.findUnique({
        where: { id: _id },
        select: {
            id: true,
            name: true,
            description: true,
            imageMain: true,
            logo: true, // VD: "AS", "LA", "VI" trong vòng tròn
            link: true,
            phoneContact: true,
            emailContact: true,
            isFeatured: true,
            images: true,
            taxCode: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            address: true,
            isNew: true,
            reason: true,
            _count: {
                select: {
                    restaurants: true
                }
            },
            template: {
                select: {
                    code: true
                }
            },
            employments: {
                where: { 
                    restaurantId: null,
                    workspaceRole: {
                        name: { in: ["Chủ thương hiệu", "Chủ thương hiệu"] }
                    }
                },
                select: {
                    user: {
                        select: { id: true, name: true, user_name: true, email: true, sdt: true, avatar: true }
                    }
                }
            },
            subscriptions: {
                where: { status: "ACTIVE" },
                select: {
                    plan: {
                        select: {
                            name: true,
                            price: true
                        }
                    }
                }
            },
            restaurants: {
                where: { 
                    statusByAdmin: "ACTIVE",
                    statusByBrand: "ACTIVE"
                }, // Chỉ lấy những nhà hàng đang mở cửa
                take: 20, // Tăng lên 20 để hiển thị nhiều nhà hàng hơn
                orderBy: [
                    { isNew: "desc" },
                    { weightedScore: "desc" }
                ],
                select: {
                    id: true,
                    name: true,
                    imageMain: true,
                    averageRating: true,
                    address: true,
                    isNew: true,
                    categories: {
                        select: {
                            name: true
                        }
                    },
                    operatingHours: {
                        where: { day_of_week: day },
                        take: 1,
                        select: {
                            open_time: true,
                            close_time: true,
                        }
                    },
                    employments: {
                        where: {
                            workspaceRole: {
                                name: "Quản lý nhà hàng"
                            }
                        },
                        select: {
                            user: {
                                select: { id: true, name: true, user_name: true, email: true, sdt: true, avatar: true }
                            }
                        }
                    },
                },
            }
        }
    });
    if (!brand) return null;
        brand.restaurants = brand.restaurants.map(({ operatingHours, ...rest }) => {
        // Lấy phần tử đầu tiên nếu mảng có dữ liệu
        const hours = operatingHours[0];
        return {
            ...rest,
            time: hours
                ? `${hours.open_time} - ${hours.close_time}`
                : "Hôm nay nghỉ"
        };
    });
    const {imageMain,images,_count,...rest}=brand;    
    return { ...rest, images: imageMain ? [imageMain, ...images] : images, restaurantCount: _count?.restaurants || 0 };
}
export const getBrands = async ({ where, page, limit }) => {
    const result = await prisma.brand.findMany({
        where: where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
            { isFeatured: "desc" },
            { createdAt: "desc" }
        ],
        select: {
            id: true,
            name: true,
            description: true,
            imageMain: true,
            logo: true,
            taxCode: true,
            emailContact: true,
            phoneContact: true,
            address: true,
            createdAt: true,
            isActive: true,
            isNew: true,
            isFeatured: true,
            link: true,
            _count: {
                select: {
                    restaurants: true // Đếm tất cả nhà hàng (hoặc giữ nguyên tuỳ ý)
                }
            },
            employments: {
                where: { 
                    restaurantId: null,
                    workspaceRole: {
                        name: { in: ["Chủ thương hiệu", "Chủ thương hiệu"] }
                    }
                },
                select: {
                    user: {
                        select: { id: true, name: true, email: true, sdt: true, avatar: true }
                    }
                }
            }
        }
    });
    if (result) {
        return result.map(({ _count, ...e }) => ({ 
            ...e, 
            numberRestaurant: _count.restaurants,
            restaurantCount: _count.restaurants 
        }))
    }
    return null
}

