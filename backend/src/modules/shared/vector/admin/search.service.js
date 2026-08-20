import { queryVector } from "../service/vectorDB.service.js";

/**
 * Tìm kiếm RAG dành cho Admin Hệ thống
 * Giới hạn: Tìm kiếm tài liệu toàn cầu
 */
export const searchForAdmin = async (queryText) => {
  console.log("[Vector Search] Admin tìm kiếm:", queryText);
  return "Tài liệu mẫu log hệ thống...";
};
