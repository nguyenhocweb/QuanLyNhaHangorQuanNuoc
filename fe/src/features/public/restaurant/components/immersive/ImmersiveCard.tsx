import React from "react";
import { usePerformanceMode } from "@/src/core/hooks/usePerformanceMode";
import { Card3DBackground } from "./Immersive3DBackground";

interface ImmersiveCardProps {
    children: React.ReactNode;
    className?: string;
}

export default function ImmersiveCard({ children, className = "" }: ImmersiveCardProps) {
    const { is3D } = usePerformanceMode();
    
    // Nếu chế độ 2D được kích hoạt (máy yếu hoặc người dùng chủ động tắt)
    if (!is3D) {
        return (
            <div className={`bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 mt-8 ${className}`}>
                {children}
            </div>
        );
    }
    
    // Ở chế độ 3D: Mỗi Card đều mang trong mình một khối đại dương (MiniOcean) riêng biệt
    // Màu chữ được tự động biến đổi thành màu trắng (Invert) để hiển thị nổi bật trên mặt nước tối màu
    return (
        <div className={`relative bg-[#001a33]/60 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl p-6 md:p-8 transition-all hover:scale-[1.01] overflow-hidden mt-8 ${className}`}>
            {/* Background 3D gợn sóng dành riêng cho từng Item */}
            <Card3DBackground />
            
            {/* 
                Ghi đè tất cả các màu text/background từ các template dùng chung 
                (do các tab được thiết kế ban đầu cho nền trắng).
                Thêm override riêng cho thẻ <option> để sửa lỗi Select dropdown bị nền trắng chữ trắng.
            */}
            <div className="relative z-10 text-white [&_.text-gray-900]:!text-white [&_.text-gray-800]:!text-white [&_.text-gray-700]:!text-gray-100 [&_.text-gray-600]:!text-gray-200 [&_.text-gray-500]:!text-gray-300 [&_.text-gray-400]:!text-gray-400 [&_.bg-gray-50]:!bg-white/10 [&_.bg-gray-100]:!bg-black/20 [&_.bg-white]:!bg-white/5 [&_.border-gray-100]:!border-white/10 [&_.border-gray-200]:!border-white/10 [&_.shadow-sm]:!shadow-black/20 [&_select]:!bg-black/20 [&_select]:!text-white [&_option]:!bg-[#001a33] [&_option]:!text-white [&_.text-indigo-600]:!text-indigo-200 [&_.text-amber-600]:!text-amber-400 [&_.border-indigo-600]:!bg-[#000a14] [&_.border-indigo-600]:!border-white/10 [&_.border-indigo-600]:!text-white [&_.border-indigo-600]:shadow-2xl [&_.bg-indigo-50]:!bg-indigo-500/20 [&_.bg-indigo-100]:!bg-indigo-500/30 [&_.border-indigo-200]:!border-indigo-500/50 [&_.hover\:bg-indigo-50:hover]:!bg-white/10 [&_.text-indigo-800]:!text-indigo-200 [&_button.bg-white.text-indigo-600]:!bg-indigo-600 [&_button.bg-white.text-indigo-600]:!text-white [&_input]:!bg-black/20 [&_input]:!text-white [&_input::placeholder]:!text-gray-400">
                {children}
            </div>
        </div>
    );
}
