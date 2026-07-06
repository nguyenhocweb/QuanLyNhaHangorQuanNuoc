import { mapOperator } from "../../llm.repository/index.js";
import { prisma } from "../../../../../databases/init.mongodb.js";
export async function executeCountMenuItem(parameters) {
    const { AND, OR } = parameters;
    const whereClause = {};

    // Xử lý mảng AND sử dụng mapOperator thần thánh
    if (AND && AND.length > 0) {
        whereClause.AND = AND.map((item) => mapOperator(item.field, item.operator, item.value));
    }

    // Xử lý mảng OR
    if (OR && OR.length > 0) {
        whereClause.OR = OR.map((item) => mapOperator(item.field, item.operator, item.value));
    }

    try {
        const count = await prisma.menuItem.count({
            where: whereClause
        });

        return {
            status: 'success',
            total: count,
            query_used: whereClause // Giữ lại cái này log ra console xem AI sinh query sướng lắm
        };
    } catch (error) {
        console.error("Lỗi Prisma khi đếm MenuItem:", error);
        return { status: 'error', message: 'Lỗi khi truy vấn CSDL món ăn' };
    }
};

 export async function executeGetMenuItems(parameters) {
    const { AND, OR, take, skip } = parameters;
    const whereClause = {};

    // Xử lý mảng AND sử dụng mapOperator thần thánh
    if (AND && AND.length > 0) {
        whereClause.AND = AND.map((item) => mapOperator(item.field, item.operator, item.value));
    }

    // Xử lý mảng OR
    if (OR && OR.length > 0) {
        whereClause.OR = OR.map((item) => mapOperator(item.field, item.operator, item.value));
    }

    try {
        const items = await prisma.menuItem.findMany({
            where: whereClause,
            // Nếu bạn có truyền thêm take/skip từ schema thì nhét vào đây luôn
            ...(take !== undefined && { take }),
            ...(skip !== undefined && { skip })
        });

        return {
            status: 'success',
            data: items,
            query_used: whereClause // Dành để log xem AI sinh query
        };
    } catch (error) {
        console.error("Lỗi Prisma khi lấy danh sách MenuItem:", error);
        return { status: 'error', message: 'Lỗi khi truy vấn CSDL danh sách món ăn' };
    }
};

export async function executeGetMenuItem(parameters) {
    const { AND, OR } = parameters;
    const whereClause = {};

    // Xử lý mảng AND
    if (AND && AND.length > 0) {
        whereClause.AND = AND.map((item) => mapOperator(item.field, item.operator, item.value));
    }

    // Xử lý mảng OR
    if (OR && OR.length > 0) {
        whereClause.OR = OR.map((item) => mapOperator(item.field, item.operator, item.value));
    }

    try {
        const item = await prisma.menuItem.findFirst({
            where: whereClause
        });

        return {
            status: 'success',
            data: item,
            query_used: whereClause // Dành để log xem AI sinh query
        };
    } catch (error) {
        console.error("Lỗi Prisma khi lấy chi tiết MenuItem:", error);
        return { status: 'error', message: 'Lỗi khi truy vấn CSDL chi tiết món ăn' };
    }
};
