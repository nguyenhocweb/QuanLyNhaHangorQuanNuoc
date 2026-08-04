import React from 'react';
import CategoryRestaurantComponent from '@/src/features/system_admin/categories/component/CategoryRestaurant_components';
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function CategoriesPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Danh mục chuẩn</h1>
                <p className="text-gray-500 text-sm">Quản lý danh mục thể loại nhà hàng (Ví dụ: Lẩu, Nướng, Hải sản...).</p>
            </div>
            <CategoryRestaurantComponent />
        </FadeIn>
    );
}
