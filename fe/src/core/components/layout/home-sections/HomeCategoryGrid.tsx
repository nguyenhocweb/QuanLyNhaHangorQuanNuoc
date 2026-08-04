"use client";

import React from "react";
import { TiltCard3D } from "../../animation/TiltCard3D";
import FadeIn from "../../animation/FadeIn";
import { useGetPublicCategories } from "@/src/features/public/categories/hook/useGetPublicCategories";
import Link from "next/link";

const DEFAULT_GRADIENTS = [
    "from-red-50 to-rose-50/50 text-red-600",
    "from-blue-50 to-cyan-50/50 text-blue-600",
    "from-purple-50 to-indigo-50/50 text-purple-600",
    "from-amber-50 to-orange-50/50 text-amber-600",
    "from-teal-50 to-emerald-50/50 text-teal-600",
    "from-emerald-50 to-green-50/50 text-emerald-600"
];

const DEFAULT_ICONS = ["🥩", "🦞", "🍷", "🔥", "🍸", "🍱", "🍜", "🍰", "🍕"];

export const HomeCategoryGrid: React.FC = () => {
    const { data, isLoading } = useGetPublicCategories();
    // API có thể trả về mảng trực tiếp hoặc trong property data/metadata
    const rawCategories = Array.isArray(data) ? data : (data?.data || data?.metadata || []);
    const categories = rawCategories.slice(0, 6);

    return (
        <div className="w-full py-16 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto flex flex-col gap-10 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                <div className="flex flex-col gap-2">
                    <FadeIn>
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit">
                            🔍 Khám phá theo khẩu vị
                        </span>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                            Danh mục Ẩm thực <span className="text-emerald-600">Thịnh hành</span>
                        </h2>
                    </FadeIn>
                </div>
                <FadeIn delay={0.2}>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Lựa chọn từ các thực đơn đa dạng được tuyển chọn gắt gao bởi các chuyên gia ẩm thực hàng đầu.
                    </p>
                </FadeIn>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                    {[1, 2, 3, 4, 5, 6].map((skel) => (
                        <div key={skel} className="w-full h-44 bg-gray-50/80 border border-gray-100 rounded-2xl p-5 animate-pulse flex flex-col justify-between">
                            <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="w-full py-12 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-400">Đang cập nhật danh mục ẩm thực từ hệ thống...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                    {categories.map((cat: any, idx: number) => {
                        const styleClass = DEFAULT_GRADIENTS[idx % DEFAULT_GRADIENTS.length];
                        const [bgClass, textClass] = styleClass.split(" ");
                        const displayIcon = cat.icon || DEFAULT_ICONS[idx % DEFAULT_ICONS.length];

                        return (
                            <FadeIn key={cat._id || cat.id || idx} delay={idx * 0.08} className="w-full">
                                <Link href={`/restaurants?category=${cat._id || cat.id || cat.name}`} className="block w-full h-full">
                                    <TiltCard3D depth={10} className="w-full h-full bg-white border border-gray-100/80 rounded-2xl p-5 hover:border-indigo-200 transition-colors flex flex-col justify-between">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bgClass} flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300 ${textClass}`}>
                                            {typeof displayIcon === "string" && displayIcon.startsWith("http") ? (
                                                <img src={displayIcon} alt={cat.name} className="w-8 h-8 object-contain" />
                                            ) : (
                                                <span>{displayIcon}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                                {cat.name}
                                            </h3>
                                            <p className="text-xs font-medium text-gray-400">{cat.description || "Khám phá ngay"}</p>
                                        </div>
                                    </TiltCard3D>
                                </Link>
                            </FadeIn>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
