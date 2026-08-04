# Tài liệu Kiến trúc & Kế hoạch Triển khai Hệ thống Phân quyền (RBAC Hybrid)

Tài liệu này đóng vai trò là "Bản thiết kế logic" để team Backend và Frontend bắt đầu xây dựng các tính năng Quản lý nhân sự và Phân quyền dựa trên bộ database schema vừa được tối ưu (`Employment`, `JobRole`, `Permission`).

---

## 1. Mô hình Phân quyền: RBAC + ABAC (Lai)
Hệ thống sử dụng mô hình phân quyền lai, mang lại tính linh hoạt cao nhất:
- **RBAC (Role-Based Access Control):** Cấp quyền theo nhóm (Vai trò công việc - `JobRole`). Giúp quản lý hàng loạt nhân viên dễ dàng.
- **ABAC (Attribute-Based Access Control / Custom Permissions):** Cấp quyền ngoại lệ trực tiếp cho từng cá nhân (`Permission_vs_Employment`). Phục vụ các trường hợp đặc biệt không theo nhóm.

**Công thức tính tổng quyền của 1 nhân viên:**
`TỔNG QUYỀN` = `[Quyền từ JobRole]` + `[Quyền ngoại lệ cấp riêng]`

---

## 2. Kế hoạch thiết kế Backend API

Chúng ta sẽ cần xây dựng 3 cụm API (Modules) chính. *Tuân thủ quy tắc chia nhỏ file theo từng CRUD action (như đã quy định trong `AGENTS.md`).*

### A. Module `permissions` (Dành cho SYSTEM ADMIN)
Module này chỉ do System Admin (Quản trị viên hệ thống) quản lý để "đẻ" ra các quyền cơ sở.
- `GET /api/v1/permissions`: Lấy danh sách toàn bộ quyền hệ thống.
- `POST /api/v1/permissions`: Tạo 1 quyền mới (VD: `name: "DELETE_ORDER"`, `type: "RESTAURANT"`).

### B. Module `job-roles` (Dành cho BRAND / RESTAURANT ADMIN)
Cho phép chủ nhà hàng tự định nghĩa các nhóm vai trò.
- `POST /api/v1/job-roles`: Tạo mới Vai trò (VD: "Thu Ngân"). Payload gửi lên bao gồm mảng `permissionIds`.
- `PUT /api/v1/job-roles/:id`: Cập nhật Vai trò (thêm/bớt quyền). *Lưu ý: Mọi nhân viên đang có JobRole này sẽ tự động được cập nhật quyền mới.*
- `GET /api/v1/job-roles`: Lấy danh sách Vai trò hiện có của nhà hàng.

### C. Module `employments` (Dành cho BRAND / RESTAURANT ADMIN)
Module quản lý hồ sơ nhân viên.
- `POST /api/v1/employments`: Thêm nhân viên. Payload cần `userId`, `restaurantId`, và `jobRoleId`.
- `PUT /api/v1/employments/:id/custom-permissions`: Cập nhật "Quyền ngoại lệ" cho riêng 1 nhân viên (Ghi vào bảng `Permission_vs_Employment`).
- `GET /api/v1/employments/my-permissions`: API cực kỳ quan trọng cho Frontend gọi sau khi User Login để lấy danh sách quyền.

---

## 3. Kiến trúc Auth Middleware (Bảo vệ API)

Để đảm bảo an toàn, cần xây dựng 1 Middleware `requirePermission` tại `src/core/middlewares/`.

**Luồng hoạt động của Middleware:**
1. Lấy thông tin `user` từ Token (đã xử lý ở bước Authentication).
2. Lấy `restaurantId` hoặc `brandId` từ Headers (để biết user đang thao tác trong ngữ cảnh nhà hàng nào).
3. Truy vấn bảng `Employment` để lấy ra:
   - Các quyền từ `jobRole` (qua `job_role_vs_permissions`).
   - Các quyền cấp riêng (qua `per_vs_emp`).
4. Gộp 2 mảng quyền lại, loại bỏ trùng lặp (Set).
5. Kiểm tra xem quyền yêu cầu của API (VD: `DELETE_BILL`) có nằm trong mảng gộp này không.
   - Trả về `Next()` nếu có.
   - Trả về `403 Forbidden` nếu không.

---

## 4. Kế hoạch thiết kế Frontend (React/Next.js)

### State Management (Zustand / React Context)
Khi User login và chọn 1 nhà hàng để làm việc, Frontend phải gọi ngay API `GET /api/v1/employments/my-permissions`.
Lưu mảng string (VD: `["CREATE_ORDER", "VIEW_REPORT"]`) vào Global State.

### Custom Component `<RequirePermission>`
Tạo một Wrapper Component để tự động ẩn/hiện UI:
```tsx
export const RequirePermission = ({ permission, children }) => {
  const myPermissions = useUserStore(state => state.permissions);
  if (!myPermissions.includes(permission)) return null; // Ẩn UI nếu ko có quyền
  return <>{children}</>;
}
```
**Cách dùng:**
```tsx
<RequirePermission permission="DELETE_BILL">
  <Button variant="destructive">Xóa Hóa Đơn</Button>
</RequirePermission>
```

---

## 5. Áp dụng cho các mô hình kinh doanh

> [!NOTE]
> Database hiện tại hỗ trợ khả năng biến hóa cho mọi mô hình kinh doanh.

| Mô hình | Cách sử dụng hệ thống phân quyền |
| :--- | :--- |
| **Quán Vỉa Hè / Quán Nhỏ (1-2 người)** | Chủ quán tạo 1 JobRole duy nhất là "ALL" (chọn hết tất cả Permission). Gán JobRole này cho tài khoản của nhân viên duy nhất. Không cần dùng Quyền ngoại lệ. |
| **Nhà Hàng Vừa (10-30 người)** | Tạo các JobRole cơ bản: "Phục Vụ" (Ghi order), "Thu Ngân" (Thanh toán), "Bếp" (Xem món). Gán JobRole tương ứng khi thêm nhân viên. |
| **Chuỗi Thương Hiệu Lớn (>100 người)** | Quản trị viên cấp Brand tạo JobRole chung từ cấp Brand. Quản lý chi nhánh chỉ việc chọn JobRole. Nếu có 1 bạn thu ngân đang thử việc làm Quản lý chi nhánh, Quản lý cấp cao sẽ dùng tính năng "Quyền ngoại lệ" để add thêm quyền "Xóa bill" cho riêng bạn đó mà không ảnh hưởng JobRole "Thu ngân" chung. |
