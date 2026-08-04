import React from 'react';
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FiSettings } from "react-icons/fi";

export default function SettingsPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
                <p className="text-gray-500 text-sm">Cấu hình chung và các tham số vận hành cho toàn bộ hệ thống Foleat.</p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 overflow-hidden flex flex-col items-center justify-center text-center gap-4">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
                    <FiSettings className="text-4xl animate-spin-slow" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">Tính năng đang được phát triển</h2>
                <p className="text-slate-500 max-w-md">Khu vực cấu hình hệ thống hiện tại đang được nâng cấp để mang lại trải nghiệm tốt hơn. Vui lòng quay lại sau.</p>
            </div>
        </FadeIn>
    );
}
