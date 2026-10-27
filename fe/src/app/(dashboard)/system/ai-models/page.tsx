import React from 'react';
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FiCpu } from "react-icons/fi";

export default function AiModelsPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Mô hình AI</h1>
                <p className="text-gray-500 text-sm">Cấu hình các mô hình trí tuệ nhân tạo (AI Models) cho hệ thống Chatbox.</p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 overflow-hidden flex flex-col items-center justify-center text-center gap-4">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
                    <FiCpu className="text-4xl" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">Tính năng đang được cập nhật</h2>
                <p className="text-slate-500 max-w-md">Khu vực cấu hình AI Models đang được nâng cấp đồng bộ với API Keys. Bạn có thể chỉ định model trực tiếp trong trang Quản lý API Key.</p>
            </div>
        </FadeIn>
    );
}
