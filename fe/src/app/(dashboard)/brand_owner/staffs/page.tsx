"use client";

import React, { Suspense } from "react";
import StaffsList from "@/src/features/brand_owner/staffs/component/StaffsList";

export default function StaffsPage() {
  return (
    <div className="w-full h-full bg-gray-50/30">
      <Suspense fallback={<div>Đang tải danh sách...</div>}>
        <StaffsList />
      </Suspense>
    </div>
  );
}
