import React from 'react';
import TableBrand from '@/src/features/system_admin/brands/brands_components/table-brands-component';
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function BrandsPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Thương hiệu</h1>
                <p className="text-gray-500 text-sm">Danh sách các thương hiệu đang hoạt động trên hệ thống.</p>
            </div>
            <TableBrand />
        </FadeIn>
    );
}
