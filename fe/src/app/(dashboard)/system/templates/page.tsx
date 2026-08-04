import React from 'react';
import { TemplateList } from '@/src/features/system_admin/templates/component/TemplateList';
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function TemplatesPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Mẫu giao diện</h1>
                <p className="text-gray-500 text-sm">Quản lý các mẫu giao diện (Templates) dành cho thương hiệu và nhà hàng.</p>
            </div>
            <TemplateList />
        </FadeIn>
    );
}
