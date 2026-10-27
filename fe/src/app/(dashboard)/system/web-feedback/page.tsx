import React from "react";
import { AdminWebFeedbackList } from "@/src/features/system_admin/web_feedback/component/AdminWebFeedbackList";

export const metadata = {
  title: "Quản Lý Đánh Giá Website | System Admin",
  description: "Kiểm duyệt, phản hồi và ghim các đánh giá, đóng góp ý kiến từ người dùng trên toàn hệ thống."
};

export default function WebFeedbackAdminPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <AdminWebFeedbackList />
    </div>
  );
}
