"use client";

import React, { useState, useEffect } from "react";
import { usePerformanceMode } from "@/src/core/hooks/usePerformanceMode";
import { 
    FaUtensils, 
    FaWineGlassAlt, 
    FaCrown, 
    FaFire, 
    FaStar, 
    FaHeart, 
    FaGem, 
    FaAward, 
    FaLeaf,
    FaCoffee
} from "react-icons/fa";

interface Props {
    children?: React.ReactNode;
}

export default function Restaurant3DBackground({ children }: Props) {
    const { is3D } = usePerformanceMode();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Hiệu ứng Parallax khi rơ chuột (chỉ kích hoạt ở chế độ 3D)
    useEffect(() => {
        if (!is3D) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 35; // Phạm vi dịch chuyển X
            const y = (clientY / window.innerHeight - 0.5) * 35; // Phạm vi dịch chuyển Y
            setMousePos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [is3D]);

    return (
        <div className={`w-full min-h-screen relative overflow-hidden transition-colors duration-700 ${
            is3D ? "bg-gradient-to-br from-white via-emerald-50/50 to-amber-50/30 text-gray-800" : "bg-white text-gray-800"
        }`}>
            {/* ==================== LỚP HỌA TIẾT NỀN CHÌM CULINARY MESH ==================== */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `linear-gradient(-45deg, rgba(16, 185, 129, 0.03) 25%, transparent 25%, transparent 50%, rgba(16, 185, 129, 0.03) 50%, rgba(16, 185, 129, 0.03) 75%, transparent 75%, transparent)`,
                    backgroundSize: "32px 32px"
                }}
            />

            {/* ==================== KHÔNG GIAN NỀN 3D CULINARY AURA (CHỈ BẬT KHI is3D === TRUE) ==================== */}
            {is3D && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    {/* --- TẦNG 1: CÁC KHỐI CẦU HÀO QUANG 3D NGỌC BÍCH & HỔ PHÁCH VỚI PARALLAX NHẸ --- */}
                    <div 
                        className="absolute top-[5%] -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/15 to-transparent rounded-full blur-[140px] animate-pulse transition-transform duration-700 ease-out"
                        style={{ 
                            animationDuration: "9s",
                            transform: `translate3d(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px, 0)` 
                        }}
                    />
                    <div 
                        className="absolute top-[35%] -right-32 w-[650px] h-[650px] bg-gradient-to-bl from-amber-500/20 via-yellow-500/15 to-transparent rounded-full blur-[150px] animate-pulse transition-transform duration-700 ease-out"
                        style={{ 
                            animationDuration: "12s",
                            transform: `translate3d(${mousePos.x * 1.8}px, ${mousePos.y * 1.8}px, 0)` 
                        }}
                    />
                    <div 
                        className="absolute top-[70%] left-[5%] w-[600px] h-[600px] bg-gradient-to-r from-teal-500/15 via-emerald-500/15 to-transparent rounded-full blur-[150px] animate-pulse transition-transform duration-700 ease-out"
                        style={{ 
                            animationDuration: "14s",
                            transform: `translate3d(${mousePos.x * -1.2}px, ${mousePos.y * -1.2}px, 0)` 
                        }}
                    />
                    <div 
                        className="absolute bottom-[2%] right-[15%] w-[500px] h-[500px] bg-gradient-to-t from-orange-500/15 via-amber-500/15 to-transparent rounded-full blur-[130px] animate-pulse transition-transform duration-700 ease-out"
                        style={{ 
                            animationDuration: "10s",
                            transform: `translate3d(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px, 0)` 
                        }}
                    />

                    {/* --- TẦNG 2: LƯỚI KHÔNG GIAN ISOMETRIC CHIỀU SÂU --- */}
                    <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.15] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

                    {/* --- TẦNG 3: CÁC LUỒNG ÁNH SÁNG DỌC CULINARY BEAMS --- */}
                    <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-emerald-500/25 to-transparent transform -skew-x-12 opacity-60" />
                    <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-amber-500/25 to-transparent transform skew-x-12 opacity-60" />

                    {/* --- TẦNG 4: HẠT BỤI BIỂU TƯỢNG ẨM THỰC 3D LƠ LỬNG (PARALLAX JEWELS) --- */}
                    <div 
                        className="absolute top-[20%] left-[8%] text-emerald-600/30 text-3xl animate-bounce transform -rotate-12 transition-transform duration-500 ease-out"
                        style={{ 
                            animationDuration: "7s",
                            transform: `translate3d(${mousePos.x * 2}px, ${mousePos.y * 2}px, 0) rotate(-12deg)` 
                        }}
                    >
                        <FaUtensils />
                    </div>
                    <div 
                        className="absolute top-[40%] right-[10%] text-amber-500/35 text-2xl animate-spin transition-transform duration-500 ease-out"
                        style={{ 
                            animationDuration: "25s",
                            transform: `translate3d(${mousePos.x * -2.2}px, ${mousePos.y * -2.2}px, 0)` 
                        }}
                    >
                        <FaStar />
                    </div>
                    <div 
                        className="absolute top-[60%] left-[12%] text-rose-500/30 text-3xl animate-pulse transition-transform duration-500 ease-out"
                        style={{ 
                            animationDuration: "6s",
                            transform: `translate3d(${mousePos.x * 1.7}px, ${mousePos.y * 1.7}px, 0) rotate(15deg)` 
                        }}
                    >
                        <FaWineGlassAlt />
                    </div>
                    <div 
                        className="absolute top-[78%] right-[20%] text-emerald-500/30 text-2xl animate-bounce transition-transform duration-500 ease-out"
                        style={{ 
                            animationDuration: "9s",
                            transform: `translate3d(${mousePos.x * -1.8}px, ${mousePos.y * -1.8}px, 0) rotate(-45deg)` 
                        }}
                    >
                        <FaLeaf />
                    </div>
                    <div 
                        className="absolute top-[30%] left-[45%] text-amber-500/25 text-xl animate-pulse transition-transform duration-500 ease-out"
                        style={{ 
                            animationDuration: "11s",
                            transform: `translate3d(${mousePos.x * 2.5}px, ${mousePos.y * 2.5}px, 0)` 
                        }}
                    >
                        <FaCrown />
                    </div>
                    <div 
                        className="absolute top-[15%] right-[28%] text-orange-500/25 text-2xl animate-pulse transition-transform duration-500 ease-out"
                        style={{ 
                            animationDuration: "8s",
                            transform: `translate3d(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px, 0) rotate(20deg)` 
                        }}
                    >
                        <FaFire />
                    </div>
                    <div 
                        className="absolute bottom-[12%] left-[30%] text-teal-500/25 text-2xl animate-bounce transition-transform duration-500 ease-out"
                        style={{ 
                            animationDuration: "12s",
                            transform: `translate3d(${mousePos.x * 1.9}px, ${mousePos.y * 1.9}px, 0) rotate(-10deg)` 
                        }}
                    >
                        <FaCoffee />
                    </div>
                    <div 
                        className="absolute top-[50%] left-[32%] text-red-500/20 text-lg animate-ping transition-transform duration-500 ease-out"
                        style={{ 
                            animationDuration: "5s",
                            transform: `translate3d(${mousePos.x * -2.8}px, ${mousePos.y * -2.8}px, 0)` 
                        }}
                    >
                        <FaHeart />
                    </div>
                </div>
            )}

            {/* ==================== KHÔNG GIAN NỘI DUNG CHÍNH (RELATIVE Z-10) ==================== */}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
}
