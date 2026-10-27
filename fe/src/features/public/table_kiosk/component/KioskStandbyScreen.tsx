"use client";

import React, { useState, useEffect } from "react";
import { MdTouchApp, MdRestaurantMenu } from "react-icons/md";
import { FaUtensils } from "react-icons/fa";
import FadeIn from "@/src/core/components/animation/FadeIn";

interface KioskStandbyScreenProps {
    restaurant: any;
    tableNumber: string;
    onUnlock: () => void;
}

export const KioskStandbyScreen: React.FC<KioskStandbyScreenProps> = ({ restaurant, tableNumber, onUnlock }) => {
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div 
            onClick={onUnlock}
            className="fixed inset-0 z-40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col justify-between p-8 sm:p-12 cursor-pointer select-none overflow-hidden"
        >
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

            {/* Top Bar */}
            <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-center border border-white/10">
                        {restaurant?.logoUrl ? (
                            <img src={restaurant.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                            <FaUtensils className="text-amber-400 text-xl" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-white">{restaurant?.name || "Nhà hàng"}</h2>
                        <span className="text-xs text-amber-400 font-medium tracking-wide uppercase">Smart Table Experience</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
                        <span className="text-xs text-slate-400 block">Vị trí bàn</span>
                        <span className="text-lg font-bold text-amber-400 font-mono">Bàn {tableNumber}</span>
                    </div>
                    <div className="text-3xl font-light tracking-wider font-mono text-white/90">
                        {currentTime}
                    </div>
                </div>
            </div>

            {/* Center Call to Action */}
            <FadeIn className="flex flex-col items-center justify-center text-center my-auto z-10 py-12">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-8 animate-bounce">
                    <MdTouchApp className="text-5xl" />
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                    Kính Chào Quý Khách
                </h1>
                <p className="text-lg sm:text-xl text-slate-300 max-w-xl mb-8 font-light">
                    Chạm vào màn hình để khám phá thực đơn hấp dẫn và tự do gọi món ngay tại bàn
                </p>

                <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-amber-300 font-semibold text-lg transition-all duration-300 shadow-xl">
                    <MdRestaurantMenu className="text-2xl" />
                    Chạm để xem thực đơn & gọi món
                </div>
            </FadeIn>

            {/* Bottom Highlights */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-center z-10">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-amber-400 font-semibold text-sm">Gọi món tức thì</span>
                    <span className="text-xs text-slate-400">Gửi trực tiếp vào bếp</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-white/10">
                    <span className="text-amber-400 font-semibold text-sm">Thanh toán tại bàn</span>
                    <span className="text-xs text-slate-400">VietQR & Ví điện tử</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-amber-400 font-semibold text-sm">Gọi phục vụ 24/7</span>
                    <span className="text-xs text-slate-400">Nhân viên hỗ trợ ngay</span>
                </div>
            </div>
        </div>
    );
};
