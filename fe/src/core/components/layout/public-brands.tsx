"use client";

import React from "react";
import Link from "next/link";
import { usePerformanceMode } from "../../hooks/usePerformanceMode";
import { TiltCard3D } from "../animation/TiltCard3D";
import FadeIn from "../animation/FadeIn";
import { 
    FaCrown, 
    FaStar, 
    FaUtensils, 
    FaStore, 
    FaUsers, 
    FaCheckCircle, 
    FaArrowRight, 
    FaWineGlassAlt, 
    FaBolt 
} from "react-icons/fa";

const PublicBrands: React.FC = () => {
    const { is3D } = usePerformanceMode();

    const handleScrollToFilters = () => {
        const element = document.getElementById("brand-filter-section");
        if (element) {
            const y = element.getBoundingClientRect().top + window.pageYOffset - 90;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <section className="w-full relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden rounded-3xl border border-indigo-500/30 shadow-2xl">
            {/* ==================== HÀO QUANG 3D & LƯỚI KHÔNG GIAN (3D GLOWING AURAS) ==================== */}
            {is3D && (
                <>
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/25 rounded-full blur-[130px] pointer-events-none animate-pulse" />
                    <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[130px] pointer-events-none" />
                    <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-500/15 rounded-full blur-[130px] pointer-events-none" />
                    {/* Grid Mesh pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                </>
            )}

            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-16 lg:py-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                {/* ==================== CỘT TRÁI: NỘI DUNG & THỐNG KÊ VIP (7 CỘT) ==================== */}
                <div className="lg:col-span-7 flex flex-col justify-center gap-6 sm:gap-8 text-center lg:text-left">
                    <FadeIn>
                        <div className="inline-flex items-center justify-center lg:justify-start gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 border border-purple-500/40 text-purple-300 text-xs font-extrabold tracking-wider uppercase shadow-md w-fit mx-auto lg:mx-0">
                            <FaCrown className="text-amber-400 text-sm animate-bounce" />
                            <span>Hệ Sinh Thái Thương Hiệu Đối Tác VIP 2026</span>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight text-white">
                            Hội Tụ Tinh Hoa <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-500">
                                Ẩm Thực Đỉnh Cao
                            </span>
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                            Nơi quy tụ những chuỗi nhà hàng danh giá nhất Việt Nam. Trải nghiệm không gian ẩm thực 5 sao, thực đơn thượng hạng và quyền lợi đặt bàn ưu tiên tuyệt đối dành cho khách hàng VIP.
                        </p>
                    </FadeIn>

                    {/* Nút hành động CTA Buttons */}
                    <FadeIn delay={0.3}>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                            <button
                                type="button"
                                onClick={handleScrollToFilters}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
                            >
                                <span>✨ Khám Phá Ngay</span>
                                <FaArrowRight className="text-xs group-hover:translate-x-1.5 transition-transform" />
                            </button>

                            <Link
                                href="/user/promotions"
                                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm tracking-wide border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2 text-center"
                            >
                                <FaWineGlassAlt className="text-pink-400" />
                                <span>Nhận Đặc Quyền VIP</span>
                            </Link>
                        </div>
                    </FadeIn>

                    {/* Thanh Thống Kê Live Stats Bar */}
                    <FadeIn delay={0.4}>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-white/10 mt-2">
                            {[
                                { icon: FaStore, count: "50+", label: "Thương hiệu VIP", color: "text-purple-400" },
                                { icon: FaUtensils, count: "500+", label: "Cơ sở nhà hàng", color: "text-emerald-400" },
                                { icon: FaUsers, count: "100K+", label: "Thực khách tin dùng", color: "text-amber-400" },
                                { icon: FaStar, count: "99.9%", label: "Đánh giá 5 sao", color: "text-rose-400" }
                            ].map((stat, idx) => {
                                const IconComponent = stat.icon;
                                return (
                                    <div 
                                        key={idx} 
                                        className="flex flex-col items-center lg:items-start p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-white/[0.08] hover:border-purple-500/40 transition-all duration-300 group"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <IconComponent className={`${stat.color} text-sm group-hover:scale-110 transition-transform`} />
                                            <span className="text-lg sm:text-xl font-black text-white tracking-tight">{stat.count}</span>
                                        </div>
                                        <span className="text-[11px] sm:text-xs text-slate-400 font-medium">{stat.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </FadeIn>
                </div>

                {/* ==================== CỘT PHẢI: KHỐI ARTWORK 3D SHOWCASE (5 CỘT) ==================== */}
                <div className="lg:col-span-5 relative w-full h-[380px] sm:h-[460px] flex items-center justify-center">
                    <FadeIn delay={0.2} className="w-full h-full">
                        <TiltCard3D depth={12} glareOpacity={0.25} className="w-full h-full rounded-3xl">
                            <div className="w-full h-full relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl group">
                                {/* Ảnh nền chất lượng cao */}
                                <img
                                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                                    alt="VIP Culinary Showcase"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80" />

                                {/* Huy hiệu Floating 1: Góc trên phải */}
                                <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md text-slate-950 px-3.5 py-2 rounded-2xl shadow-xl border border-white flex items-center gap-2 animate-bounce duration-1000">
                                    <span className="text-base">🍷</span>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[10px] uppercase font-bold text-slate-500">Trải nghiệm</span>
                                        <span className="text-xs font-black text-slate-900">Thượng Hạng 5★</span>
                                    </div>
                                </div>

                                {/* Huy hiệu Floating 2: Góc dưới trái */}
                                <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-xl p-4.5 rounded-2xl border border-white/15 shadow-2xl flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md flex-shrink-0">
                                            👑
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                                <span>Đối Tác Độc Quyền</span>
                                                <FaCheckCircle className="text-emerald-400 text-xs" />
                                            </span>
                                            <span className="text-[11px] text-slate-300 line-clamp-1">
                                                Đặt bàn trực tuyến giữ chỗ 100%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                                        <FaBolt className="animate-pulse" /> 30s
                                    </div>
                                </div>
                            </div>
                        </TiltCard3D>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default PublicBrands;