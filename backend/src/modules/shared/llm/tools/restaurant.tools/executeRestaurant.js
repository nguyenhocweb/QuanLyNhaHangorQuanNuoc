import { mapOperator } from "../../llm.repository/index.js"
import { prisma } from "../../../../../databases/init.mongodb.js";
export async function executeCountRestaurant(parameters) {
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
    const count = await prisma.restaurant.count({
      where: whereClause
    });

    return {
      status: 'success',
      total: count,
      query_used: whereClause // Trả về để log debug xem AI build query đúng không
    };
  } catch (error) {
    console.error("Prisma Error:", error);
    return { status: 'error', message: 'Lỗi khi truy vấn CSDL' };
  }
}
export async function executeGetRestaurants(parameters) {
  const { AND, OR, take, skip } = parameters;
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
    const restaurants = await prisma.restaurant.findMany({
      where: whereClause,
      ...(take !== undefined && { take }),
      ...(skip !== undefined && { skip })
    });

    return {
      status: 'success',
      data: restaurants,
      query_used: whereClause 
    };
  } catch (error) {
    console.error("Prisma Error khi lấy danh sách Restaurant:", error);
    return { status: 'error', message: 'Lỗi khi truy vấn CSDL danh sách nhà hàng' };
  }
}

export async function executeGetRestaurant(parameters) {
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
    const restaurant = await prisma.restaurant.findFirst({
      where: whereClause
    });

    return {
      status: 'success',
      data: restaurant,
      query_used: whereClause
    };
  } catch (error) {
    console.error("Prisma Error khi lấy chi tiết Restaurant:", error);
    return { status: 'error', message: 'Lỗi khi truy vấn CSDL chi tiết nhà hàng' };
  }
}