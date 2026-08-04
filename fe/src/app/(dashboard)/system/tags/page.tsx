import React from 'react';
import TagsList from '@/src/features/system_admin/tags/component/TagsList';
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function TagsPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Thẻ (Tags)</h1>
                <p className="text-gray-500 text-sm">Quản lý các thẻ phân loại giúp tối ưu tìm kiếm cho người dùng.</p>
            </div>
            <TagsList />
        </FadeIn>
    );
}
