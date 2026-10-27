import React from "react";
import { AdminContactTicketList } from "@/src/features/system_admin/contact_ticket/component/AdminContactTicketList";

export const metadata = {
  title: "Quản lý Phiếu Hỗ Trợ & CSKH | NVNguyen Admin",
  description: "Trung tâm tiếp nhận và giải quyết yêu cầu hỗ trợ khách hàng"
};

export default function AdminContactTicketPage() {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <AdminContactTicketList />
    </div>
  );
}
