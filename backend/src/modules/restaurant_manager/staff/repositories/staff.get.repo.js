import { prisma } from "../../../../databases/init.mongodb.js";

export const getStaffsRepo = async (restaurantId, { skip, take, search, salary_type }) => {
  const where = {
    restaurantId,
    workspaceRole: {
      name: "Nhân viên"
    }
  };

  if (salary_type && salary_type !== "ALL") {
    where.salary_type = salary_type;
  }

  if (search) {
    const orConditions = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { sdt: { contains: search, mode: "insensitive" } },
    ];

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
            systemRole: {
              select: {
                name: true,
              }
            }
          }
        },
        workspaceRole: {
          select: {
            name: true,
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
