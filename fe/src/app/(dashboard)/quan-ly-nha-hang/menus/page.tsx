"use client";

import React from "react";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import useRealtimeUpdates from "@/src/core/hooks/useRealtimeUpdates";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { RestaurantMenuList } from "@/src/features/quan_ly_nha_hang/menus/component/RestaurantMenuList";
import { MdOutlineRestaurantMenu } from "react-icons/md";

export default function RestaurantMenusPage() {
    const { activeWorkspace } = useAuthStore();
    const restaurantId = activeWorkspace?.id || "";
    useRealtimeUpdates(restaurantId);

    return (
        <FadeIn className="w-full flex flex-col gap-6 p-6 md:p-8">
            {/* Header Block */}
            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <MdOutlineRestaurantMenu className="text-2xl" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-gray-800">Thực đơn Chi nhánh</h1>
                        <p className="text-sm text-gray-500">
                            Quản lý tình trạng phục vụ (còn hàng/hết hàng) và cấu hình giá bán theo địa điểm.
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu List */}
            {restaurantId ? (
                <RestaurantMenuList restaurantId={restaurantId} />
            ) : (
                <div className="w-full bg-amber-50 text-amber-800 p-6 rounded-2xl border border-amber-200 text-center">
                    <p className="font-semibold">Vui lòng chọn một chi nhánh làm việc từ thanh điều hướng để xem thực đơn.</p>
                </div>
            )}
        </FadeIn>
    );
}
