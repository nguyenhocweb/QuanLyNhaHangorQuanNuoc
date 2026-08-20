"use client";

import React from "react";
import Image from "next/image";
import { FaCrown, FaCheckCircle, FaBuilding, FaGem, FaFileContract, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { usePerformanceMode } from "@/src/core/hooks/usePerformanceMode";

interface BrandDetailHeroProps {
    data: any;
}

export default function BrandDetailHero({ data }: BrandDetailHeroProps) {
    const { is3D } = usePerformanceMode();

    if (!data) return null;

    // Ảnh bìa chính
    const coverImage = data.imageMain || (data.images && data.images.length > 0 ? data.images[0] : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop");
    
    // Xử lý logo: Nếu là URL thì hiển thị ảnh, nếu là chuỗi ngắn thì hiển thị chữ
    const isUrlLogo = data.logo && (data.logo.startsWith("http") || data.logo.startsWith("/"));
    const logoText = data.logo ? data.logo.substring(0, 3).toUpperCase() : data.name ? data.name.substring(0, 2).toUpperCase() : "VIP";

    // Xử lý địa chỉ an toàn
    const getAddressString = () => {
        if (!data.address) return "Trụ sở toàn quốc";
        if (typeof data.address === "string") return data.address;
        return data.address.city || data.address.province || data.address.street || data.address.address || "TP. Hồ Chí Minh";
    };

    // Gói cước đối tác
    const planName = data.subscriptions?.[0]?.plan?.name || "Đối tác Chiến lược VIP";
    const restaurantCount = data.restaurantCount ?? (data.restaurants?.length || 0);

    return (
        <div className="flex flex-col gap-8 w-full animate-fade-in">
            
            {/* 1. COVER BANNER & LOGO HOÀNG GIA */}
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
                {/* Ảnh bìa Parallax Zoom */}
                <Image
                    src={coverImage}
                    alt={data.name || "Brand Cover"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                />
                
                {/* Lớp phủ gradient tối dần xuống dưới để làm nổi bật tên thương hiệu */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/60 via-transparent to-purple-950/60 mix-blend-multiply" />

                {/* Huy hiệu VIP góc trên trái */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/90 text-slate-950 font-black text-xs sm:text-sm shadow-lg backdrop-blur-md animate-pulse">
                        <FaCrown className="text-sm" />
                        Thương hiệu Đối tác VIP
                    </span>
                    {data.isFeatured && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600/90 text-white font-bold text-xs sm:text-sm shadow-lg backdrop-blur-md">
                            <FaStar className="text-amber-300" />
                            Tiêu biểu
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/90 text-white font-semibold text-xs sm:text-sm shadow-lg backdrop-blur-md">
                        <FaCheckCircle />
                        {data.isActive === "ACTIVE" ? "Đã xác thực" : "Hoạt động"}
                    </span>
                </div>

                {/* Phần Header nổi bên dưới cover: Logo + Tên thương hiệu */}
                <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                    {/* Khung Logo Vàng Kim */}
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl border-4 border-amber-400/90 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 shadow-2xl flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {isUrlLogo ? (
                            <Image src={data.logo} alt="Logo" fill className="object-cover p-1" />
                        ) : (
                            <span className="text-2xl sm:text-4xl font-black bg-gradient-to-tr from-amber-300 via-yellow-100 to-amber-500 bg-clip-text text-transparent tracking-widest">
                                {logoText}
                            </span>
                        )}
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-2xl sm:rounded-3xl pointer-events-none" />
                    </div>

                    {/* Tên thương hiệu & Tagline */}
                    <div className="flex flex-col gap-1 sm:gap-2 flex-1">
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-400">
                            Hệ sinh thái Ẩm thực Đẳng cấp
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                            {data.name}
                        </h1>
                    </div>
                </div>
            </div>

            {/* 2. CÂU CHUYỆN THƯƠNG HIỆU (STORY & DESCRIPTION) */}
            {data.description && (
                <div className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
                    is3D
                        ? "bg-white/5 border border-white/10 text-gray-200 backdrop-blur-2xl shadow-xl shadow-indigo-950/50"
                        : "bg-white border border-gray-200/80 text-gray-700 shadow-lg shadow-gray-100"
                }`}>
                    <h3 className={`text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 ${
                        is3D ? "text-amber-400" : "text-indigo-600"
                    }`}>
                        <FaCrown className="text-amber-500" />
                        Câu chuyện thương hiệu
                    </h3>
                    <p className="text-base sm:text-lg leading-relaxed font-normal">
                        {data.description}
                    </p>
                </div>
            )}

            {/* 3. BỘ 4 THẺ THỐNG KÊ CHỈ SỐ UY TÍN (KEY METRICS 4-GRID) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                {/* Thẻ 1: Quy mô Hệ thống */}
                <div className={`p-5 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 ${
                    is3D
                        ? "bg-gradient-to-br from-indigo-950/80 to-slate-900/80 border border-indigo-500/30 text-white shadow-lg shadow-indigo-950/50"
                        : "bg-white border border-gray-200 text-gray-800 shadow-md hover:shadow-lg"
                }`}>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl flex-shrink-0">
                        <FaBuilding />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl sm:text-3xl font-black text-indigo-500">{restaurantCount}</span>
                        <span className={`text-xs font-semibold ${is3D ? "text-gray-300" : "text-gray-500"}`}>Chi nhánh Nhà hàng</span>
                    </div>
                </div>

                {/* Thẻ 2: Gói Đối tác VIP */}
                <div className={`p-5 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 ${
                    is3D
                        ? "bg-gradient-to-br from-purple-950/80 to-slate-900/80 border border-purple-500/30 text-white shadow-lg shadow-purple-950/50"
                        : "bg-white border border-gray-200 text-gray-800 shadow-md hover:shadow-lg"
                }`}>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl flex-shrink-0">
                        <FaGem />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-base sm:text-lg font-black text-purple-500 truncate">{planName}</span>
                        <span className={`text-xs font-semibold ${is3D ? "text-gray-300" : "text-gray-500"}`}>Đặc quyền Đối tác VIP</span>
                    </div>
                </div>

                {/* Thẻ 3: Mã số thuế & Pháp lý */}
                <div className={`p-5 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 ${
                    is3D
                        ? "bg-gradient-to-br from-amber-950/80 to-slate-900/80 border border-amber-500/30 text-white shadow-lg shadow-amber-950/50"
                        : "bg-white border border-gray-200 text-gray-800 shadow-md hover:shadow-lg"
                }`}>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl flex-shrink-0">
                        <FaFileContract />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg sm:text-xl font-bold text-amber-500 truncate">{data.taxCode || "Đã kiểm duyệt"}</span>
                        <span className={`text-xs font-semibold ${is3D ? "text-gray-300" : "text-gray-500"}`}>Mã số thuế & Pháp lý</span>
                    </div>
                </div>

                {/* Thẻ 4: Trụ sở chính */}
                <div className={`p-5 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 ${
                    is3D
                        ? "bg-gradient-to-br from-emerald-950/80 to-slate-900/80 border border-emerald-500/30 text-white shadow-lg shadow-emerald-950/50"
                        : "bg-white border border-gray-200 text-gray-800 shadow-md hover:shadow-lg"
                }`}>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl flex-shrink-0">
                        <FaMapMarkerAlt />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-base sm:text-lg font-bold text-emerald-500 truncate">{getAddressString()}</span>
                        <span className={`text-xs font-semibold ${is3D ? "text-gray-300" : "text-gray-500"}`}>Khu vực hoạt động</span>
                    </div>
                </div>

            </div>

        </div>
    );
}
