# BẢNG TRA CỨU HÀM/UTILITY DÙNG CHUNG (FUNCTION REGISTRY)

> *File này được tách riêng khỏi CONTEXT.md để ĐẢM BẢO KHÔNG BAO GIỜ bị nén/archive. BẮT BUỘC tra cứu bảng này trước khi viết code mới.*

## 1. Frontend Registry (React/Vue/Angular)

| Tên Hàm / Component | Vị Trí File (Đường dẫn) | Ngôn ngữ/Stack | Chức năng chính |
|---|---|---|---|
| `useDebounce` | `fe/src/core/hooks/useDebounce.ts` | React/Vue | Delay execution của input search |
| `ConfirmModal` | `fe/src/core/components/ConfirmModal.tsx` | React | Popup xác nhận xóa |

## 2. Backend Registry (Node/Python/Go/Java)

| Tên Hàm / Tiện Ích | Vị Trí File (Đường dẫn) | Ngôn ngữ/Stack | Chức năng chính |
|---|---|---|---|
| `formatCurrency` | `src/core/utils/formatter.js` | Node/JS | Định dạng tiền tệ VND |
| `asyncHandler` | `src/core/utils/asyncHandler.js` | Express (Node) | Bọc try-catch cho Controller |
