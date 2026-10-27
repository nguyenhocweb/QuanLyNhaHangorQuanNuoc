"use client";

import React from "react";
import Link from "next/link";
import { CulinarySphere3D } from "../../animation/CulinarySphere3D";
import { TiltCard3D } from "../../animation/TiltCard3D";
import { ParallaxFloating3D } from "../../animation/ParallaxFloating3D";
import FadeIn from "../../animation/FadeIn";
import { useRestaurandCard } from "@/src/features/public/restaurant/restaurant_hook/useRestaurantCard_hook";

const formatAddress = (address: any): string => {
    if (!address) return "Hệ thống nhà hàng cao cấp";
    if (typeof address === "string") return address;
    if (typeof address === "object" && address !== null) {
        return [address.street, address.ward, address.district, address.province]
            .filter(Boolean)
            .join(", ") || "Hệ thống nhà hàng cao cấp";
    }
    return "Hệ thống nhà hàng cao cấp";
};

export const HomeHero3D: React.FC = () => {
    // Lấy 1 nhà hàng nổi bật nhất từ Database theo quy tắc Real Data Only Rule
    const { data: restData, isLoading: isRestLoading } = useRestaurandCard({ page: 1, limit: 1 });
    const vipRest = restData?.data?.[0] || (Array.isArray(restData) ? restData[0] : null);

    const restName = vipRest?.name || "NVNguyen Grand Dining";
    const restImage = vipRest?.imageMain || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";
    const restAddress = formatAddress(vipRest?.address);
    const restRating = vipRest?.averageRating || 4.9;

    return (
        <div className="w-full min-h-[90vh] relative flex items-center justify-center overflow-hidden py-12 sm:py-16 px-4 sm:px-12 lg:px-20 max-w-7xl mx-auto z-10">
            {/* Lưới 2 cột */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10">
                
                {/* Cột Trái: Thông điệp Tinh hoa */}
                <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left gap-4 sm:gap-6 z-10 min-w-0 w-full overflow-hidden">
                    <FadeIn delay={0.1} className="w-full flex justify-center lg:justify-start">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-sm max-w-full">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping shrink-0" />
                            <span className="truncate">✨ Đặt bàn & Ẩm thực 3D số 1 VN</span>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2} className="w-full">
                        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.25] sm:leading-[1.15] break-words text-center lg:text-left">
                            Khám phá <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Không gian Ẩm thực</span> Tinh hoa chuẩn 3D
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.3} className="w-full">
                        <p className="text-sm sm:text-lg text-gray-600 max-w-xl font-normal leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
                            Trải nghiệm công nghệ xem bàn tương tác 3D WebGL trực quan, kết nối trực tiếp với hơn 500 nhà hàng sang trọng cùng ưu đãi độc quyền dành cho bạn.
                        </p>
                    </FadeIn>

                    {/* Nút Call to Action */}
                    <FadeIn delay={0.4} className="w-full flex justify-center lg:justify-start">
                        <div className="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2 w-full max-w-sm sm:max-w-md lg:max-w-none">
                            <Link
                                href="/restaurants"
                                className="flex-1 sm:flex-none px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-sm sm:text-base shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(79,70,229,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 text-center flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <span>🍽️ Đặt bàn ngay</span>
                            </Link>

                            <Link
                                href="/user/promotions"
                                className="flex-1 sm:flex-none px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm sm:text-base border border-gray-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center whitespace-nowrap"
                            >
                                <span>🎁 Khám phá Ưu đãi</span>
                            </Link>
                        </div>
                    </FadeIn>

                    {/* Thống kê nhanh */}
                    <FadeIn delay={0.5} className="w-full pt-4 sm:pt-8 border-t border-gray-100 mt-2 flex justify-center lg:justify-start">
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-6 text-center max-w-md lg:max-w-none w-full mx-auto lg:mx-0">
                            <div className="flex flex-col min-w-0">
                                <span className="text-lg sm:text-3xl font-extrabold text-gray-900">500+</span>
                                <span className="text-[10px] sm:text-sm text-gray-500 font-medium truncate">Nhà hàng Đối tác</span>
                            </div>
                            <div className="flex flex-col border-l border-gray-100 pl-1.5 sm:pl-6 min-w-0">
                                <span className="text-lg sm:text-3xl font-extrabold text-indigo-600">10,000+</span>
                                <span className="text-[10px] sm:text-sm text-gray-500 font-medium truncate">Khách Hài lòng</span>
                            </div>
                            <div className="flex flex-col border-l border-gray-100 pl-1.5 sm:pl-6 min-w-0">
                                <span className="text-lg sm:text-3xl font-extrabold text-emerald-600">4.9/5 ⭐</span>
                                <span className="text-[10px] sm:text-sm text-gray-500 font-medium truncate">Đánh giá 5 sao</span>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Cột Phải: Showcase 3D Nhà hàng VIP từ Database */}
                <div className="lg:col-span-5 flex items-center justify-center relative w-full h-[400px] sm:h-[520px] overflow-hidden sm:overflow-visible">
                    
                    {/* Khối cầu WebGL 3D thực thụ nằm ở background card */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-60 h-60 sm:w-96 sm:h-96">
                            <CulinarySphere3D color="#6366f1" size={1.5} speed={1.2} />
                        </div>
                    </div>

                    {/* Thẻ Bài Nhà Hàng VIP với hiệu ứng Tilt 3D & Glare */}
                    <FadeIn delay={0.3} className="w-full max-w-[280px] sm:max-w-sm z-10">
                        <TiltCard3D
                            depth={20}
                            glareOpacity={0.3}
                            className="w-full bg-white/90 backdrop-blur-xl border border-white/60 p-4 sm:p-6 rounded-3xl shadow-[0_25px_50px_-12px_rgba(79,70,229,0.15)] flex flex-col gap-3 sm:gap-4 relative"
                        >
                            <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden shadow-inner bg-gray-100">
                                {isRestLoading ? (
                                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                                        <span className="text-xs text-gray-400">Đang tải nhà hàng VIP...</span>
                                    </div>
                                ) : (
                                    <img
                                        src={restImage}
                                        alt={restName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";
                                        }}
                                    />
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-extrabold text-amber-500 shadow-sm flex items-center gap-1">
                                    <span>★</span> {Number(restRating).toFixed(1)}
                                </div>
                                <div className="absolute bottom-3 left-3 bg-indigo-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                                    👑 Nhà hàng Nổi bật
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                                    {restName}
                                </h3>
                                <p className="text-xs font-medium text-gray-500 truncate">
                                    📍 {restAddress}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                                <span className="text-emerald-600 text-[11px] sm:text-xs">✓ Không cần cọc</span>
                                <Link
                                    href={vipRest?.id ? `/restaurant/${vipRest?.id}` : "/restaurants"}
                                    className="text-indigo-600 hover:text-indigo-800 underline transition-colors text-[11px] sm:text-xs"
                                >
                                    Xem 3D &rarr;
                                </Link>
                            </div>
                        </TiltCard3D>
                    </FadeIn>

                    {/* Các Huy hiệu Vệ tinh Lơ lửng Parallax 3D */}
                    <ParallaxFloating3D duration={3} depthZ={40} className="absolute top-2 left-0 sm:left-4 z-20 scale-85 sm:scale-100 origin-left">
                        <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 animate-bounce-slow">
                            <span className="text-lg">⭐</span>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-gray-400 uppercase">Danh hiệu</span>
                                <span className="text-[11px] font-extrabold text-gray-800">Chuẩn Michelin 2026</span>
                            </div>
                        </div>
                    </ParallaxFloating3D>

                    <ParallaxFloating3D duration={4} depthZ={-30} className="absolute bottom-3 right-0 sm:right-2 z-20 scale-85 sm:scale-100 origin-right">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                            <span className="text-lg">🔥</span>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-amber-100 uppercase">Ưu đãi</span>
                                <span className="text-[11px] font-extrabold">Giảm 20% đặt bàn</span>
                            </div>
                        </div>
                    </ParallaxFloating3D>

                    <ParallaxFloating3D duration={5} depthZ={20} className="absolute -bottom-2 left-6 z-20 hidden sm:block">
                        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2">
                            <span className="text-lg">🧑‍🍳</span>
                            <span className="text-xs font-bold text-gray-700">Bếp trưởng 5 sao</span>
                        </div>
                    </ParallaxFloating3D>
                </div>
            </div>
        </div>
    );
};
