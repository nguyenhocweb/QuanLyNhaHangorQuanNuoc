import { prisma } from "../../../../databases/init.mongodb.js"

export const countBrands = async (where = {}) => {
    const condition = (where && typeof where === 'object' && 'where' in where) ? where.where : where;
    return prisma.brand.count({
        where: condition || {}
    });
};

export const getBrandsPagination = countBrands;
const today = new Date();
const day = today.getDay();//lấy thứ trong tuần

export const createBrand = async (data) => {
    const brand = await prisma.brand.create({
        data: data
    });
    return brand.id;
};

export const updateBrandById = async (id, data) => {
    try {
        const brand = await prisma.brand.update({
            where: { id: id },
            data: data
        });
        return brand;
    } catch (error) {
        return null;
    }
};

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
            phone_contact: true,
            email_contact: true,
            isFeatured: true,
            images: true,
            tax_code: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            address: true,
            new: true,
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
                select: {
                    restaurantId: true,
                    workspaceRole: { select: { name: true } },
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
                    ratingStats: true,
                    address: true,
                    isNew: true,
                    categoryRestaurants: {
                        select: {
                            name: true
                        }
                    },
                    operating_hours: {
                        where: { day_of_week: day },
                        take: 1,
                        select: {
                            open_time: true,
                            close_time: true,
                        }
                    },
                    employments: {
                        select: {
                            restaurantId: true,
                            workspaceRole: { select: { name: true } },
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

    // Lọc quản lý thương hiệu cấp Brand
    brand.employments = (brand.employments || []).filter(
        e => !e.restaurantId && e.workspaceRole?.name === "Quản lý thương hiệu"
    );

    brand.restaurants = brand.restaurants.map(({ operating_hours, employments, ...rest }) => {
        // Lấy phần tử đầu tiên nếu mảng có dữ liệu
        const hours = operating_hours?.[0];
        const restaurantManagers = (employments || []).filter(
            e => e.workspaceRole?.name === "Quản lý nhà hàng"
        );

        return {
            ...rest,
            employments: restaurantManagers,
            time: hours
                ? `${hours.open_time} - ${hours.close_time}`
                : "Hôm nay nghỉ"
        };
    });

    const { _count, tax_code, email_contact, phone_contact, new: isNewField, imageMain, images, ...rest } = brand;
    rest.taxCode = rest.tax_code;
    delete rest.tax_code;
    rest.emailContact = rest.email_contact;
    delete rest.email_contact;
    rest.phoneContact = rest.phone_contact;
    delete rest.phone_contact;
    rest.isNew = rest.new;
    delete rest.new;
    
    brand.restaurants = brand.restaurants.map(r => {
        r.averageRating = r.ratingStats?.averageRating || 0;
        delete r.ratingStats;
        return r;
    });

    return { ...rest, employments: brand.employments, restaurants: brand.restaurants, images: imageMain ? [imageMain, ...images] : images, restaurantCount: _count?.restaurants || 0 };
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
            tax_code: true,
            email_contact: true,
            phone_contact: true,
            address: true,
            createdAt: true,
            isActive: true,
            new: true,
            isFeatured: true,
            link: true,
            _count: {
                select: {
                    restaurants: true // Đếm tất cả nhà hàng
                }
            },
            employments: {
                select: {
                    restaurantId: true,
                    workspaceRole: { select: { name: true } },
                    user: {
                        select: { id: true, name: true, user_name: true, email: true, sdt: true, avatar: true }
                    }
                }
            }
        }
    });

    if (result) {
        return result.map(({ _count, tax_code, email_contact, phone_contact, new: isNewField, employments, ...e }) => ({ 
            ...e, 
            taxCode: tax_code,
            emailContact: email_contact,
            phoneContact: phone_contact,
            isNew: isNewField,
            numberRestaurant: _count.restaurants,
            restaurantCount: _count.restaurants,
            employments: (employments || []).filter(
                emp => !emp.restaurantId && emp.workspaceRole?.name === "Quản lý thương hiệu"
            )
        }));
    }
    return null;
}
