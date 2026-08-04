"use client";

import React, { useState, useEffect } from "react";
import { usePerformanceMode } from "@/src/core/hooks/usePerformanceMode";
import { FaCrown, FaGem, FaAward, FaStar, FaUtensils, FaMagic } from "react-icons/fa";

interface BrandDetail3DBackgroundProps {
    children: React.ReactNode;
}

export default function BrandDetail3DBackground({ children }: BrandDetail3DBackgroundProps) {
    const { is3D, isLowEnd } = usePerformanceMode();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!is3D || isLowEnd) return;
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 40;
            const y = (e.clientY / innerHeight - 0.5) * 40;
            setMousePos({ x, y });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [is3D, isLowEnd]);

    // --- CHẾ ĐỘ 2D SENIOR PRO MAX (SIÊU MƯỢT 60 FPS) ---
    if (!is3D) {
        return (
            <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-white text-gray-900 overflow-hidden selection:bg-amber-500 selection:text-white transition-colors duration-500">
                {/* Trang trí tĩnh vân ngọc trai sang trọng */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-300/15 via-purple-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-amber-300/15 via-orange-200/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-gradient-to-t from-blue-300/15 to-transparent rounded-full blur-3xl pointer-events-none" />
                
                {/* Lưới nốt nhạc / chấm vân tinh tế */}
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {children}
                </div>
            </div>
        );
    }

    // --- CHẾ ĐỘ 3D ROYAL SAPPHIRE & GOLD (SIÊU THỰC TẾ & CHIỀU SÂU) ---
    return (
        <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 text-white overflow-hidden selection:bg-amber-400 selection:text-black transition-colors duration-500">
            
            {/* Lớp lưới ánh sáng hào quang Vũ Trụ Hoàng Gia */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.35),rgba(255,255,255,0))] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b15_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b15_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            {/* Các quả cầu ánh sáng 3D Parallax */}
            <div
                className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-600/30 to-amber-500/20 blur-[100px] pointer-events-none transition-transform duration-700 ease-out"
                style={{ transform: `translate3d(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px, 0)` }}
            />
            <div
                className="absolute top-1/2 right-10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-transparent blur-[120px] pointer-events-none transition-transform duration-700 ease-out"
                style={{ transform: `translate3d(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px, 0)` }}
            />
            <div
                className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-gradient-to-t from-amber-500/25 to-indigo-500/20 blur-[90px] pointer-events-none transition-transform duration-700 ease-out"
                style={{ transform: `translate3d(${mousePos.x * 0.8}px, ${mousePos.y * -0.8}px, 0)` }}
            />

            {/* Các biểu tượng Hoàng Gia 3D lơ lửng trong không gian */}
            <div
                className="absolute top-32 right-1/4 text-amber-400/20 text-5xl sm:text-6xl animate-pulse pointer-events-none transition-transform duration-500"
                style={{ transform: `translate3d(${mousePos.x * 2}px, ${mousePos.y * 2}px, 0) rotate(15deg)` }}
            >
                <FaCrown />
            </div>
            <div
                className="absolute top-1/4 left-16 text-indigo-400/20 text-4xl sm:text-5xl animate-bounce pointer-events-none transition-transform duration-500"
                style={{ transform: `translate3d(${mousePos.x * -2}px, ${mousePos.y * -1.5}px, 0) rotate(-20deg)` }}
            >
                <FaGem />
            </div>
            <div
                className="absolute bottom-1/3 right-12 text-purple-400/20 text-5xl animate-pulse pointer-events-none transition-transform duration-500"
                style={{ transform: `translate3d(${mousePos.x * 1.5}px, ${mousePos.y * -2}px, 0) rotate(25deg)` }}
            >
                <FaAward />
            </div>
            <div
                className="absolute bottom-20 left-1/4 text-amber-300/15 text-4xl animate-spin pointer-events-none transition-transform duration-500"
                style={{ animationDuration: '20s', transform: `translate3d(${mousePos.x * -1}px, ${mousePos.y * 1.5}px, 0)` }}
            >
                <FaStar />
            </div>
            <div
                className="absolute top-2/3 left-12 text-teal-400/15 text-4xl pointer-events-none transition-transform duration-500"
                style={{ transform: `translate3d(${mousePos.x * -1.8}px, ${mousePos.y * 0.5}px, 0) rotate(-15deg)` }}
            >
                <FaUtensils />
            </div>

            {/* Nội dung chính của trang được bọc trong container VIP */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {children}
            </div>
        </div>
    );
}
