import { tools_Brand } from "./brand.tools/index.js";
import { tools_Restaurant } from "./restaurant.tools/index.js";
import { tools_MenuItem } from "./dish/index.js";

/**
 * Role-Based Access Control (RBAC) cho AI Tools
 * Phân quyền các tool mà từng nhân cách AI được phép sử dụng.
 */
export const getToolsByRole = (role) => {
  let allowedTools = [];

  switch (role) {
    case 'CUSTOMER':
      // Khách hàng: Chỉ được xem menu và danh sách nhà hàng (Không được xem đếm số lượng hay thống kê)
      // Giả sử ta lọc những hàm bắt đầu bằng 'get' cho an toàn (hoặc có thể chia mảng riêng)
      // Tạm thời ta cấp quyền xem nhà hàng và món ăn
      allowedTools = [
        ...tools_Restaurant,
        ...tools_MenuItem
      ];
      break;

    case 'Nhân viên':
    case 'Quản lý nhà hàng':
      // Quản lý nhà hàng: Được xem menu, xem nhà hàng, và một số tool đếm nhất định của chi nhánh họ
      allowedTools = [
        ...tools_Restaurant,
        ...tools_MenuItem
      ];
      break;

    case 'Quản lý thương hiệu':
    case 'BRAND_OWNER':
      // Quản lý thương hiệu: Được xem mọi thứ liên quan đến kinh doanh, brand
      allowedTools = [
        ...tools_Brand,
        ...tools_Restaurant,
        ...tools_MenuItem
      ];
      break;

    case 'Admin':
    case 'SYSTEM_ADMIN':
      // Admin hệ thống: Full quyền (Thậm chí sau này có tool system riêng)
      allowedTools = [
        ...tools_Brand,
        ...tools_Restaurant,
        ...tools_MenuItem
      ];
      break;

    default:
      // Fallback an toàn nhất: Quyền khách hàng vãng lai
      allowedTools = [
        ...tools_Restaurant,
        ...tools_MenuItem
      ];
      break;
  }

  // Bọc lại theo đúng format của thư viện GenAI (Gemini)
  // Lưu ý: Sau này khi tích hợp các Hãng khác, việc chuẩn hóa tools sẽ nằm ở Adapter
  return [
    {
      functionDeclarations: allowedTools
    }
  ];
};