"use client";

import React, { Suspense } from "react";
import Restaurant3DBackground from "@/src/features/public/restaurant/restaurant_components/demo-card-restaurant/restaurant-3d-background";
import RestaurantFilterBar from "@/src/features/public/restaurant/restaurant_components/demo-card-restaurant/RestaurantFilterBar";
import Featured_Restaurant_Component from "@/src/features/public/restaurant/restaurant_components/demo-card-restaurant/featured-restaurant-component";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useScrollTo } from "@/src/core/hooks/useScrollTo";
import { FaUtensils, FaStar, FaShieldAlt, FaArrowDown, FaCrown } from "react-icons/fa";

const RestaurantPageContent = () => {
    const scrollToSection = useScrollTo(100);

    return (
        <Restaurant3DBackground>
            <main className="w-full min-h-screen pb-20 flex flex-col gap-12 sm:gap-16 relative z-10">
                
                {/* ==================== 1. HERO SECTION GLASSMORPHISM CAO CẤP ==================== */}
                <section className="w-full pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center relative">
                    <FadeIn className="flex flex-col items-center gap-6 max-w-4xl">
                        
                        {/* Huy hiệu Vương miện Thượng hạng */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/15 to-amber-500/15 border border-emerald-500/30 text-emerald-800 text-xs sm:text-sm font-extrabold shadow-sm animate-pulse">
                            <FaCrown className="text-amber-500 text-base" />
                            <span>HỆ THỐNG NHÀ HÀNG ĐỐI TÁC NVNGUYEN</span>
                        </div>

                        {/* Tiêu đề chính Gradient Ngọc bích & Hổ phách */}
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 leading-[1.15]">
                            Khám Phá Tinh Hoa{" "}
                            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
                                Ẩm Thực Thượng Hạng
                            </span>
                        </h1>

                        {/* Đoạn mô tả cảm hứng */}
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl font-medium leading-relaxed">
                            Đặt bàn giữ chỗ nhanh chóng, chiêm ngưỡng không gian 3D thực tế sống động và thưởng thức thực đơn tinh hoa từ các thương hiệu ẩm thực hàng đầu Việt Nam.
                        </p>

                        {/* Nút Khám phá cuộn mượt xuống danh sách */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => scrollToSection("restaurants-list")}
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-300 group cursor-pointer"
                            >
                                <span>🍽️ Khám phá hệ thống ngay</span>
                                <FaArrowDown className="text-xs group-hover:translate-y-1 transition-transform duration-200" />
                            </button>
                        </div>
                    </FadeIn>

                    {/* --- BỘ 3 THẺ THỐNG KÊ KÍNH MỜ (STATS CARDS) --- */}
                    <FadeIn delay={0.2} className="w-full mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-md flex items-center gap-4 text-left hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
                                <FaUtensils />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-gray-900 text-lg">50+ Nhà Hàng VIP</h4>
                                <p className="text-xs text-gray-500 font-medium">Hệ thống tuyển chọn sang trọng</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-md flex items-center gap-4 text-left hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-500 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
                                <FaStar />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-gray-900 text-lg">4.9 / 5.0 Đánh Giá</h4>
                                <p className="text-xs text-gray-500 font-medium">Từ hàng ngàn thực khách hài lòng</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-md flex items-center gap-4 text-left hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-teal-100/80 text-teal-600 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
                                <FaShieldAlt />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-gray-900 text-lg">100% Bảo Chứng VIP</h4>
                                <p className="text-xs text-gray-500 font-medium">Giữ bàn nhanh chóng & tin cậy</p>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                {/* ==================== 2. THANH BỘ LỌC KÍNH MỜ (FILTER BAR) ==================== */}
                <section id="restaurants-list" className="w-full pt-4 scroll-mt-24">
                    <FadeIn delay={0.25} className="w-full">
                        <RestaurantFilterBar />
                    </FadeIn>
                </section>

                {/* ==================== 3. DANH SÁCH NHÀ HÀNG & PHÂN TRANG ==================== */}
                <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn delay={0.3} className="w-full">
                        <Featured_Restaurant_Component type="page" />
                    </FadeIn>
                </section>

            </main>
        </Restaurant3DBackground>
    );
};

export default function RestaurantPage() {
    return (
        <Suspense fallback={
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold text-gray-600 animate-pulse">Đang chuẩn bị không gian ẩm thực 3D...</p>
            </div>
        }>
            <RestaurantPageContent />
        </Suspense>
    );
}