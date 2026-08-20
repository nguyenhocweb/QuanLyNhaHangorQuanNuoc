import { searchForCustomer } from "../../vector/customer/search.service.js";
import { searchForManager } from "../../vector/manager/search.service.js";
import { searchForOwner } from "../../vector/owner/search.service.js";
import { searchForAdmin } from "../../vector/admin/search.service.js";

/**
 * RAG Engine: Trích xuất và bơm tài liệu (Context) vào Prompt
 */
export class RAGEngine {
  /**
   * Lấy tài liệu từ Vector DB dựa theo Role và truy vấn
   * @param {string} role - Vai trò của người dùng
   * @param {string} query - Câu hỏi của người dùng
   * @param {string} entityId - ID của Brand hoặc Restaurant (nếu có)
   * @returns {string} - Văn bản ngữ cảnh (Context)
   */
  static async retrieveContext(role, query, entityId = null) {
    try {
      switch (role) {
        case 'CUSTOMER':
        case 'customer':
          return await searchForCustomer(query);
        case 'Nhân viên':
        case 'Quản lý nhà hàng':
        case 'manager':
          return await searchForManager(query, entityId);
        case 'Chủ thương hiệu':
        case 'BRAND_OWNER':
        case 'owner':
          return await searchForOwner(query, entityId);
        case 'Admin':
        case 'SYSTEM_ADMIN':
        case 'admin':
          return await searchForAdmin(query);
        default:
          return await searchForCustomer(query);
      }
    } catch (error) {
      console.error("[RAG Engine] Lỗi khi trích xuất tài liệu:", error.message);
      // Fallback an toàn: Trả về rỗng thay vì làm sập luồng chat
      return "Không tìm thấy tài liệu ngữ cảnh nào phù hợp.";
    }
  }
}
