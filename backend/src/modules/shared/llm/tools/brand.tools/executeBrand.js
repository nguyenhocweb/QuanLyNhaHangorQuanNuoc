import { mapOperator } from "../../llm.repository/index.js"
import { prisma } from "../../../../../databases/init.mongodb.js";
export async function executeGetBrands(parameters) {
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
    const brands = await prisma.brand.findMany({
      where: whereClause,
      ...(take !== undefined && { take }),
      ...(skip !== undefined && { skip })
    });

    return {
      status: 'success',
      data: brands,
      query_used: whereClause // Trả về để log debug xem AI build query đúng không
    };
  } catch (error) {
    console.error("Prisma Error khi lấy danh sách Brand:", error);
    return { status: 'error', message: 'Lỗi khi truy vấn CSDL danh sách thương hiệu' };
  }
}

export async function executeGetBrand(parameters) {
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
    const brand = await prisma.brand.findFirst({
      where: whereClause
    });

    return {
      status: 'success',
      data: brand,
      query_used: whereClause
    };
  } catch (error) {
    console.error("Prisma Error khi lấy chi tiết Brand:", error);
    return { status: 'error', message: 'Lỗi khi truy vấn CSDL chi tiết thương hiệu' };
  }
}


export async function executeCountBrand(parameters) {
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
    const count = await prisma.brand.count({
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