"use client";

import React, { useState, useEffect } from "react";
import { usePerformanceMode } from "@/src/core/hooks/usePerformanceMode";

interface Props {
    children?: React.ReactNode;
}

export default function Brand3DBackground({ children }: Props) {
    const { is3D } = usePerformanceMode();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Hiệu ứng Parallax tương tác chuột (chỉ kích hoạt ở chế độ 3D)
    useEffect(() => {
        if (!is3D) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 35;
            const y = (clientY / window.innerHeight - 0.5) * 35;
            setMousePos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [is3D]);

    return (
        <div className={`w-full min-h-screen relative overflow-hidden transition-colors duration-500 ${
            is3D ? "bg-gradient-to-br from-white via-slate-50 to-purple-50/20 text-gray-800" : "bg-white text-gray-800"
        }`}>
            {/* ==================== LỚP HỌA TIẾT NỀN CHÌM SỌC CHÉO (DIAGONAL STRIPED TEXTURE) ==================== */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage: `linear-gradient(-45deg, rgba(139, 92, 246, 0.025) 25%, transparent 25%, transparent 50%, rgba(139, 92, 246, 0.025) 50%, rgba(139, 92, 246, 0.025) 75%, transparent 75%, transparent)`,
                    backgroundSize: "32px 32px"
                }}
            />

            {/* ==================== HỆ THỐNG VỆT SỌC & ĐƯỜNG CHÉO GEOMETRIC ĐA SẮC (NO HORIZONTAL LINES) ==================== */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* --- HÀO QUANG NỀN SÂU 3D (CHỈ BẬT Ở CHẾ ĐỘ 3D) --- */}
                {is3D && (
                    <>
                        <div 
                            className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/15 via-indigo-500/10 to-transparent rounded-full blur-[140px] animate-pulse transition-transform duration-700 ease-out"
                            style={{ transform: `translate3d(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px, 0)` }}
                        />
                        <div 
                            className="absolute top-1/3 -right-32 w-[650px] h-[650px] bg-gradient-to-bl from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-[150px] animate-pulse transition-transform duration-700 ease-out"
                            style={{ transform: `translate3d(${mousePos.x * 1.8}px, ${mousePos.y * 1.8}px, 0)` }}
                        />
                        <div 
                            className="absolute -bottom-32 left-1/4 w-[550px] h-[550px] bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-[140px] animate-pulse transition-transform duration-700 ease-out"
                            style={{ transform: `translate3d(${mousePos.x * -1.2}px, ${mousePos.y * -1.2}px, 0)` }}
                        />
                    </>
                )}

                {/* --- NHÓM 1: CÁC VỆT SỌC CHÉO DÀY ĐA SẮC (THICK COLORFUL DIAGONAL RIBBONS 4px - 8px) --- */}
                {/* Vệt sọc Tím Indigo (Góc 60 độ cực dốc, tuyệt đối không bị ngang) */}
                <div 
                    className={`absolute -top-[10%] left-[10%] w-[6px] h-[150%] bg-gradient-to-b from-transparent via-purple-500/40 to-transparent transform rotate-[60deg] transition-all duration-700 rounded-full ${
                        is3D ? "shadow-[0_0_20px_rgba(168,85,247,0.3)] opacity-90" : "opacity-60"
                    }`}
                    style={is3D ? { transform: `rotate(60deg) translate3d(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px, 0)` } : undefined}
                />
                {/* Vệt sọc Vàng Gold / Amber (Góc -60 độ cắt ngược) */}
                <div 
                    className={`absolute -top-[20%] right-[15%] w-[8px] h-[160%] bg-gradient-to-b from-transparent via-amber-400/45 to-transparent transform -rotate-[60deg] transition-all duration-700 rounded-full ${
                        is3D ? "shadow-[0_0_25px_rgba(251,191,36,0.4)] opacity-95" : "opacity-70"
                    }`}
                    style={is3D ? { transform: `rotate(-60deg) translate3d(${mousePos.x * -1.4}px, ${mousePos.y * -1.4}px, 0)` } : undefined}
                />
                {/* Vệt sọc Xanh Cyan / Blue (Góc 55 độ) */}
                <div 
                    className={`absolute -top-[15%] left-[45%] w-[5px] h-[160%] bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent transform rotate-[55deg] transition-all duration-700 rounded-full ${
                        is3D ? "shadow-[0_0_20px_rgba(6,182,212,0.35)] opacity-90" : "opacity-65"
                    }`}
                    style={is3D ? { transform: `rotate(55deg) translate3d(${mousePos.x * -0.9}px, ${mousePos.y * -0.9}px, 0)` } : undefined}
                />
                {/* Vệt sọc Hồng Rose / Pink (Góc -55 độ) */}
                <div 
                    className={`absolute -top-[10%] left-[25%] w-[6px] h-[150%] bg-gradient-to-b from-transparent via-rose-500/35 to-transparent transform -rotate-[55deg] transition-all duration-700 rounded-full ${
                        is3D ? "shadow-[0_0_22px_rgba(244,63,94,0.3)] opacity-85" : "opacity-55"
                    }`}
                    style={is3D ? { transform: `rotate(-55deg) translate3d(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px, 0)` } : undefined}
                />

                {/* --- NHÓM 2: CÁC ĐƯỜNG LASER CHÉO THAO TÁC SẮC NÉT (SHARP DIAGONAL BEAMS 1.5px - 2px) --- */}
                {/* Tia Laser Vàng Amber góc dốc -55 độ */}
                <div 
                    className={`absolute -top-[25%] left-[60%] w-[2px] h-[165%] bg-gradient-to-b from-transparent via-amber-500/50 to-transparent transform -rotate-[55deg] transition-all duration-700 ${
                        is3D ? "shadow-[0_0_15px_#f59e0b] opacity-85" : "opacity-60"
                    }`}
                    style={is3D ? { transform: `rotate(-55deg) translate3d(${mousePos.x * -1.1}px, ${mousePos.y * -1.1}px, 0)` } : undefined}
                />
                {/* Tia Laser Tím Violet góc dốc 60 độ */}
                <div 
                    className={`absolute -top-[15%] right-[30%] w-[1.5px] h-[160%] bg-gradient-to-b from-transparent via-purple-600/50 to-transparent transform rotate-[60deg] transition-all duration-700 ${
                        is3D ? "shadow-[0_0_15px_#9333ea] opacity-90" : "opacity-65"
                    }`}
                    style={is3D ? { transform: `rotate(60deg) translate3d(${mousePos.x * 1.3}px, ${mousePos.y * 1.3}px, 0)` } : undefined}
                />
                {/* Tia Laser Xanh Blue góc dốc 58 độ */}
                <div 
                    className={`absolute -top-[20%] left-[20%] w-[2px] h-[160%] bg-gradient-to-b from-transparent via-blue-500/45 to-transparent transform rotate-[58deg] transition-all duration-700 ${
                        is3D ? "shadow-[0_0_16px_#3b82f6] opacity-85" : "opacity-60"
                    }`}
                />
                {/* Tia Laser Ngọc Bích Cyan góc dốc -62 độ */}
                <div 
                    className={`absolute -top-[15%] right-[5%] w-[2px] h-[150%] bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent transform -rotate-[62deg] transition-all duration-700 ${
                        is3D ? "shadow-[0_0_15px_#22d3ee] opacity-85" : "opacity-55"
                    }`}
                    style={is3D ? { transform: `rotate(-62deg) translate3d(${mousePos.x * 1.6}px, ${mousePos.y * 1.6}px, 0)` } : undefined}
                />
                {/* Tia Laser Fuchsia / Hồng góc dốc 65 độ */}
                <div 
                    className={`absolute top-[10%] -left-[10%] w-[2px] h-[150%] bg-gradient-to-b from-transparent via-fuchsia-500/40 to-transparent transform rotate-[65deg] transition-all duration-700 ${
                        is3D ? "shadow-[0_0_18px_#d946ef] opacity-80" : "opacity-50"
                    }`}
                />

                {/* --- NHÓM 3: CÁC KHỐI HÌNH HỌC CHÉO PHÁT SÁNG (FLOATING GEOMETRIC DIAGONAL SHAPES) --- */}
                <div 
                    className={`absolute top-[25%] right-[10%] w-24 h-48 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent border-l-2 border-t-2 border-purple-500/30 transform -rotate-[55deg] rounded-3xl pointer-events-none transition-all duration-700 ${
                        is3D ? "shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-pulse" : "opacity-40"
                    }`}
                    style={is3D ? { transform: `rotate(-55deg) translate3d(${mousePos.x * -1.8}px, ${mousePos.y * -1.8}px, 0)` } : undefined}
                />
                <div 
                    className={`absolute top-[60%] left-[8%] w-32 h-56 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border-r-2 border-b-2 border-amber-500/30 transform rotate-[60deg] rounded-3xl pointer-events-none transition-all duration-700 ${
                        is3D ? "shadow-[0_0_30px_rgba(245,158,11,0.15)] animate-pulse" : "opacity-40"
                    }`}
                    style={is3D ? { transform: `rotate(60deg) translate3d(${mousePos.x * 2.1}px, ${mousePos.y * 2.1}px, 0)` } : undefined}
                />
                <div 
                    className={`absolute top-[40%] left-[38%] w-20 h-40 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border-l-2 border-b-2 border-cyan-500/30 transform -rotate-[58deg] rounded-2xl pointer-events-none transition-all duration-700 ${
                        is3D ? "shadow-[0_0_25px_rgba(6,182,212,0.15)] animate-pulse" : "opacity-35"
                    }`}
                />
            </div>

            {/* ==================== KHÔNG GIAN NỘI DUNG CHÍNH (RELATIVE Z-10) ==================== */}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
}
