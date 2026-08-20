import { queryVector } from "../service/vectorDB.service.js";

/**
 * Tìm kiếm RAG dành cho Quản lý Nhà hàng
 * Giới hạn: Tìm kiếm tài liệu vận hành chi nhánh
 */
export const searchForManager = async (queryText, restaurantId) => {
  console.log(`[Vector Search] Quản lý chi nhánh ${restaurantId} tìm kiếm:`, queryText);
  return "Tài liệu mẫu cho quản lý chi nhánh...";
};
