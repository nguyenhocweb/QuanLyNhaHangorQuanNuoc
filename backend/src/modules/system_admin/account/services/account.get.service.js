import { accountGetRepository } from "../repositories/account.get.repository.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

export const getAccountsService = async (query) => {
  const { search, role, status, dateFilter } = query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const where = {};

  // 1. Filter by Search
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { sdt: { contains: search, mode: "insensitive" } },
      { user_name: { contains: search, mode: "insensitive" } }
    ];
  }

  // 2. Filter by Role
  if (role) {
    if (role === "Admin" || role === "Khách hàng") {
      where.systemRole = { name: role };
    } else {
      where.employments = {
        some: {
          workspaceRole: { name: role }
        }
      };
    }
  } else {
    // Không lấy tài khoản Admin hệ thống khi xem tất cả
    where.systemRole = {
      name: { not: "Admin" }
    };
  }

  // 3. Filter by Status
  if (status) {
    where.is_active = status === "LOCKED" ? "BANNED" : status;
  }

  // 4. Filter by Date (this_month)
  if (dateFilter === "this_month") {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    where.createdAt = {
      gte: startOfMonth
    };
  }

  const skip = (page - 1) * limit;

  const totalRecords = await accountGetRepository.countUsersByCondition(where);
  const totalPages = Math.ceil(totalRecords / limit) || 1;

  if (page > totalPages && totalRecords > 0) {
    throw new BadRequestError(`Trang ${page} không tồn tại. Tổng số trang hiện có là ${totalPages}`);
  }

  const [users, totalUsers, newUsers30Days, lockedUsers] = await Promise.all([
    accountGetRepository.getUsers(where, skip, limit),
    accountGetRepository.countUsersByCondition(),
    accountGetRepository.countUsersByCondition({
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    }),
    accountGetRepository.countUsersByCondition({
      is_active: "BANNED"
    })
  ]);

  const formattedUsers = users.map(user => ({
    id: user.id,
    name: user.name || user.user_name,
    email: user.email,
    phone: user.sdt,
    role: user.systemRole?.name === "Admin" ? "Admin" : (user.employments?.length > 0 ? user.employments[0].workspaceRole?.name : user.systemRole?.name) || "UNKNOWN",
    status: user.is_active,
    createdAt: user.createdAt,
    avatar: user.avatar,
    employments: user.employments
  }));

  return {
    data: formattedUsers,
    stats: {
      totalUsers,
      newUsers30Days,
      lockedUsers
    },
    meta: {
      totalRecords,
      currentPage: page,
      totalPages: totalPages === 0 ? 1 : totalPages,
      limit
    }
  };
};
