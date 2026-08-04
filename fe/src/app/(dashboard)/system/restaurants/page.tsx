import React from 'react';
import Restaurant_components from '@/src/features/system_admin/restaurants/component/Restaurant_components';
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function RestaurantsPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Nhà hàng</h1>
                <p className="text-gray-500 text-sm">Danh sách toàn bộ nhà hàng, chi nhánh trên hệ thống.</p>
            </div>
            <Restaurant_components />
        </FadeIn>
    );
}
