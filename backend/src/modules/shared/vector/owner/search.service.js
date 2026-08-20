import { queryVector } from "../service/vectorDB.service.js";

/**
 * Tìm kiếm RAG dành cho Chủ Thương Hiệu
 * Giới hạn: Tìm kiếm tài liệu phân tích, báo cáo toàn chuỗi
 */
export const searchForOwner = async (queryText, brandId) => {
  console.log(`[Vector Search] Chủ thương hiệu ${brandId} tìm kiếm:`, queryText);
  return "Tài liệu mẫu cho báo cáo doanh thu...";
};
