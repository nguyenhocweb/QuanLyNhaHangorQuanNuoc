import { prisma } from "../../../../databases/init.mongodb.js";

export const getEmploymentsRepo = async (brandId, { skip, take, search, restaurantId }) => {
  const where = {
    brandId,
    user: {
      role: {
        name: {
          notIn: ["Admin", "Quản lý thương hiệu"]
        }
      }
    }
  };

  if (restaurantId) {
    where.restaurantId = restaurantId;
  }

  if (search) {
    const orConditions = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { sdt: { contains: search, mode: "insensitive" } },
    ];

    // Hỗ trợ tìm theo userId nếu là ObjectId (24 ký tự hex)
    if (/^[0-9a-fA-F]{24}$/.test(search)) {
      orConditions.push({ id: search });
    }

    where.user = {
      ...where.user,
      OR: orConditions,
    };
  }

  const [employments, total] = await Promise.all([
    prisma.employment.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            sdt: true,
            role: {
              select: {
                name: true,
              }
            }
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true,
          }
        },
        per_vs_emp: {
          include: {
            permissions: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        }
      },
    }),
    prisma.employment.count({ where }),
  ]);

  return { employments, total };
};
