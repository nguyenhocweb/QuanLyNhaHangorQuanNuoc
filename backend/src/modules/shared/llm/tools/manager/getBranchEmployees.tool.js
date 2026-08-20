import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const getBranchEmployeesSchema = {
  name: "getBranchEmployees",
  description: "Lấy danh sách nhân viên đang làm việc tại nhà hàng (chi nhánh). Dành cho Quản lý.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      role: {
        type: SchemaType.STRING,
        description: "Lọc theo chức vụ (vd: Nhân viên, Bếp, Thu ngân). Để trống để lấy tất cả."
      },
      limit: {
        type: SchemaType.INTEGER,
        description: "Số lượng tối đa (mặc định 10)."
      }
    }
  }
};

export const executeGetBranchEmployees = async (args, context) => {
  try {
    const { role, limit = 10 } = args;
    const { restaurantId } = context;

    if (!restaurantId) return { error: "Không xác định được chi nhánh." };

    const whereClause = { restaurantId, status: "ACTIVE" };

    const employees = await prisma.employment.findMany({
      where: whereClause,
      take: Math.min(limit, 20),
      include: {
        user: { select: { user_name: true, email: true, phone: true } }
      }
    });

    let filtered = employees;
    if (role) {
      // Filter by role title inside employment (if title field existed) or just return all for now if no title field
      filtered = employees.filter(e => e.title && e.title.toLowerCase().includes(role.toLowerCase()));
    }

    const dto = filtered.map(e => ({
      employmentId: e.id,
      name: e.user?.user_name,
      phone: e.user?.phone,
      title: e.title || "Nhân viên",
      startDate: e.startDate
    }));

    return { data: dto, count: dto.length };
  } catch (error) {
    console.error("[getBranchEmployees] Error:", error.message);
    return { error: "Lỗi tải danh sách nhân viên: " + error.message };
  }
};
