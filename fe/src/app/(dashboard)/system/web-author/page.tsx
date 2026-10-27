import React from "react";
import { AdminWebAuthorList } from "@/src/features/system_admin/web_author/component/AdminWebAuthorList";

export const metadata = {
  title: "Quản Lý Đội Ngũ Tác Giả | System Admin",
  description: "Quản trị thông tin, vai trò, tech stack và thứ tự hiển thị của các kỹ sư làm web trên hệ thống."
};

export default function WebAuthorAdminPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <AdminWebAuthorList />
    </div>
  );
}
