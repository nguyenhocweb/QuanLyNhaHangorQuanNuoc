"use client";

import React from "react";
import { TiltCard3D } from "../../animation/TiltCard3D";
import FadeIn from "../../animation/FadeIn";
import { useGetFeaturedReviews } from "@/src/features/public/review/hook/useGetFeaturedReviews";

export const HomeSocialProofMarquee: React.FC = () => {
    const { data, isLoading } = useGetFeaturedReviews(9);
    const reviews = data?.metadata?.items || [];

    return (
        <div className="w-full py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto flex flex-col gap-12 relative overflow-hidden">
            <div className="flex flex-col items-center text-center gap-3">
                <FadeIn>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3.5 py-1.5 rounded-full shadow-sm">
                        💬 Trải nghiệm Thực tế
                    </span>
                </FadeIn>
                <FadeIn delay={0.1}>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        Thực khách nói gì về <span className="text-indigo-600">NVNguyen?</span>
                    </h2>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <p className="text-sm text-gray-500 max-w-lg">
                        Hàng nghìn bữa ăn trọn vẹn mỗi ngày cùng những lời khen ngợi từ cộng đồng yêu ẩm thực là động lực lớn nhất của chúng tôi.
                    </p>
                </FadeIn>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((skeleton) => (
                        <div key={skeleton} className="w-full h-56 bg-gray-50/80 border border-gray-100 rounded-3xl p-6 animate-pulse flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                                <div className="h-16 bg-gray-200 rounded w-full" />
                            </div>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <div className="w-11 h-11 bg-gray-200 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    <div className="h-2 bg-gray-200 rounded w-3/4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="w-full py-12 text-center bg-gray-50/50 rounded-3xl border border-gray-100">
                    <p className="text-sm text-gray-400">Chưa có đánh giá nổi bật nào được ghi nhận gần đây.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviews.map((t, idx) => (
                        <FadeIn key={t.id} delay={idx * 0.15} className="w-full">
                            <TiltCard3D depth={8} className="w-full h-full bg-gradient-to-b from-white to-gray-50/80 border border-gray-100 p-6 rounded-3xl shadow-sm flex flex-col justify-between gap-4">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex text-amber-400 text-sm">{"★".repeat(t.rating)}</div>
                                        <span className="text-[11px] font-semibold text-gray-400">{t.date}</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed line-clamp-4">
                                        "{t.comment}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-11 h-11 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
                                        }}
                                    />
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-xs font-bold text-gray-900 truncate">{t.name}</span>
                                        <span className="text-[10px] text-gray-500 truncate">{t.role} • <strong className="text-indigo-600">{t.restaurant}</strong></span>
                                    </div>
                                </div>
                            </TiltCard3D>
                        </FadeIn>
                    ))}
                </div>
            )}
        </div>
    );
};
