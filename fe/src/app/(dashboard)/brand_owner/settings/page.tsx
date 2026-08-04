import React from 'react';
import TemplateSelection from '@/src/features/brand_owner/settings/components/TemplateSelection';
import FadeIn from '@/src/core/components/animation/FadeIn';

export const metadata = {
    title: "Cài đặt Thương hiệu | Brand Owner",
};

export default function BrandSettingsPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-800">Cài đặt Thương hiệu</h1>
                <p className="text-slate-500 text-sm">Quản lý giao diện hiển thị cho trang chủ thương hiệu và các trang chi nhánh của bạn.</p>
            </div>
            
            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                {/* Ở đây có thể làm Tabs nếu sau này có thêm các cài đặt khác (Ví dụ: Cài đặt Thông báo, Thanh toán...) */}
                {/* Hiện tại chỉ có Cài đặt Giao diện */}
                <TemplateSelection />
            </div>
        </FadeIn>
    );
}
