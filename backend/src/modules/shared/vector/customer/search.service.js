import { queryVector } from "../service/vectorDB.service.js";

/**
 * Tìm kiếm RAG dành cho Khách Hàng
 * Giới hạn: Chỉ tìm kiếm trong collection MenuItems và Restaurants
 */
export const searchForCustomer = async (queryText) => {
  console.log("[Vector Search] Khách hàng tìm kiếm:", queryText);
  // Ví dụ logic RAG search giới hạn
  // return await queryVectorDB(queryText, { collections: ['menu', 'restaurant'] });
  return "Tài liệu mẫu cho khách hàng...";
};
