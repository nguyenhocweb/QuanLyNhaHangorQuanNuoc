"use client";

import React from "react";
import Link from "next/link";
import FadeIn from "../../animation/FadeIn";

export const HomeCtaBanner: React.FC = () => {
    return (
        <div className="w-full py-16 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto mb-12">
            <FadeIn>
                <div className="w-full rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-indigo-500/30 flex flex-col items-center text-center gap-6">
                    {/* Hào quang sáng 3D nền */}
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-bold uppercase tracking-wider">
                        🚀 Khám phá Không gian Ẩm thực
                    </span>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white max-w-2xl leading-tight">
                        Sẵn sàng cho <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Bữa tiệc Ẩm thực</span> tiếp theo?
                    </h2>

                    <p className="text-sm sm:text-base text-gray-300 max-w-xl font-normal leading-relaxed">
                        Tham gia cộng đồng hơn 10,000 thành viên NVNguyen ngay hôm nay để nhận quyền lợi tích điểm VIP và giảm giá đặt bàn lên đến 30%.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <Link
                            href="/login"
                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.7)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                        >
                            <span>Tham gia & Đặt bàn ngay</span>
                        </Link>

                        <Link
                            href="/contact"
                            className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/20 backdrop-blur-md hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <span>🤝 Hợp tác Nhà hàng</span>
                        </Link>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};
