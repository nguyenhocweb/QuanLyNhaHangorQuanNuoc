import React from 'react';
import AmenitiesList from '@/src/features/system_admin/amenities/component/AmenitiesList';
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function AmenitiesPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Tiện ích</h1>
                <p className="text-gray-500 text-sm">Thiết lập các tiện ích mà nhà hàng có thể cung cấp (Có WiFi, Chỗ để ô tô...).</p>
            </div>
            <AmenitiesList />
        </FadeIn>
    );
}
