"use client";

import React from "react";
import { usePerformanceMode } from "../../hooks/usePerformanceMode";
import { toast } from "sonner";

export const PerformanceToggleButton: React.FC<{ className?: string }> = ({ className = "" }) => {
    const { is3D, toggleMode, isLowEnd } = usePerformanceMode();

    const handleToggle = () => {
        toggleMode();
        if (is3D) {
            toast.info("Đã chuyển sang chế độ 2D Senior Pro Max (Siêu mượt 60 FPS)");
        } else {
            toast.success("Đã bật chế độ 3D Interactive (Trải nghiệm chiều sâu tối đa)");
        }
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            title={isLowEnd ? "Hệ thống nhận diện máy cấu hình thấp, khuyến nghị dùng 2D" : "Nhấp để đổi chế độ hiệu ứng hiển thị"}
            className={`group flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold shadow-md transition-all duration-300 backdrop-blur-md z-50 ${
                is3D
                    ? "bg-indigo-900/80 text-indigo-100 border-indigo-500/50 hover:bg-indigo-800 shadow-indigo-500/20"
                    : "bg-emerald-900/80 text-emerald-100 border-emerald-500/50 hover:bg-emerald-800 shadow-emerald-500/20"
            } hover:scale-105 active:scale-95 ${className}`}
        >
            <span className="text-base animate-bounce">{is3D ? "⚡" : "🚀"}</span>
            <div className="flex flex-col text-left">
                <span className="leading-none">{is3D ? "Chế độ 3D" : "Chế độ 2D"}</span>
                <span className="text-[10px] opacity-75 font-normal leading-tight">
                    {is3D ? "WebGL Interactive" : "Senior Pro Max 60FPS"}
                </span>
            </div>
            {isLowEnd && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" title="Tự động tối ưu cho máy yếu" />
            )}
        </button>
    );
};
