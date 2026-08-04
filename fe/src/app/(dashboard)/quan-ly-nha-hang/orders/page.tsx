"use client";

import React from "react";
import RestaurantOrderList from "@/src/features/quan_ly_nha_hang/orders/component/RestaurantOrderList";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { FiAlertCircle } from "react-icons/fi";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { Div } from "@/src/core/components/ui";

export default function OrdersPage() {
  const { activeWorkspace } = useAuthStore();
  const restaurantId = activeWorkspace?.id || "";

  if (!restaurantId) {
    return (
      <Div className="min-h-screen bg-gray-50/30 p-4 md:p-8 w-full flex items-center justify-center font-sans" vitri="col_none">
        <FadeIn className="w-full max-w-md">
          <Div variant="bg_white" shape="square" className="w-full flex-col items-center justify-center gap-4 !p-8 text-center !rounded-3xl border border-red-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
              <FiAlertCircle className="text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-2">Lỗi truy cập</h2>
            <p className="text-gray-500 text-[15px]">
              Vui lòng chọn một nhà hàng cụ thể từ danh sách để quản lý đơn hàng.
            </p>
          </Div>
        </FadeIn>
      </Div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 md:p-8 w-full">
      <div className="w-full max-w-[1400px] mx-auto">
        <RestaurantOrderList restaurantId={restaurantId} />
      </div>
    </div>
  );
}
