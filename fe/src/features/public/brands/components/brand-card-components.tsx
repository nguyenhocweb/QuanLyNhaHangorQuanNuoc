"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandCardType } from "../types/brand-card-type";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { MdStorefront } from "react-icons/md";
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaBuilding, FaCalendarAlt, FaCheckCircle, FaInfoCircle, FaMapMarkerAlt } from "react-icons/fa";

const BRAND_GRADIENTS = [
    "from-indigo-600 to-purple-600",
    "from-emerald-500 to-teal-700",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-blue-600 to-cyan-600",
    "from-violet-600 to-fuchsia-600",
];

const getBrandInitials = (name?: string): string => {
    if (!name || typeof name !== "string") return "BR";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const formatAddress = (address: any): string => {
    if (!address) return "Đang cập nhật";
    if (typeof address === "string") return address;
    if (typeof address === "object" && address !== null) {
        return [address.street, address.ward, address.district, address.province]
            .filter(Boolean)
            .join(", ") || "Hệ thống NVNguyen";
    }
    return "Hệ thống NVNguyen";
};

const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "Đang cập nhật";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;
    } catch {
        return "Đang cập nhật";
    }
};

const Brand_Card_Components = ({
    dataBrand,
    index
}: {
    dataBrand: BrandCardType;
    index: number;
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const gradientClass = BRAND_GRADIENTS[index % BRAND_GRADIENTS.length];
    const initials = getBrandInitials(dataBrand.name);
    const totalRestaurants = dataBrand.numberRestaurant || (dataBrand as any).restaurantCount || 0;

    return (
        <FadeIn delay={(index % 6) * 0.1} className="w-full h-full">
            {/* Container chính group có chiều cao cố định */}
            <div
                className="w-full h-[370px] [perspective:1000px] group cursor-default"
                onMouseLeave={() => setIsFlipped(false)}
            >
                {/* Thẻ 3D chứa cả mặt trước và mặt sau */}
                <div
                    className={`w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] ${
                        isFlipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
                >
                    {/* ==================== MẶT TRƯỚC (FRONT FACE) ==================== */}
                    <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] flex flex-col justify-between bg-white/90 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm transition-all duration-300 overflow-hidden ${isFlipped ? "pointer-events-none" : "hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200"}`}>
                        {/* VÙNG KÍCH HOẠT LẬT THẺ: Rơ chuột vào hình ảnh, banner, logo hay nội dung quán SẼ LẬT THẺ */}
                        <div
                            onMouseEnter={() => setIsFlipped(true)}
                            className="flex-1 flex flex-col cursor-pointer"
                        >
                            {/* Phần Header Hình ảnh Banner Thương hiệu */}
                            <div className="relative w-full h-44 overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                    src={`${dataBrand.imageMain}?auto=format&fit=crop&w=800&q=80`}
                                    alt={dataBrand.name || "Thương hiệu Đối tác"}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                                {/* Huy hiệu số lượng cơ sở */}
                                {totalRestaurants > 0 && (
                                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-gray-900 text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-gray-100">
                                        <MdStorefront className="text-purple-600 text-sm" />
                                        <span>{totalRestaurants} cơ sở</span>
                                    </div>
                                )}
                            </div>

                            {/* Phần Nội dung dưới Banner với Logo Tròn Nổi giao thoa */}
                            <div className="px-5 pt-0 pb-3 flex flex-col justify-between flex-1 relative">
                                <div className="flex items-center justify-between -mt-7 mb-2">
                                    <div className={`w-14 h-14 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-extrabold text-base overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                        {dataBrand.logo && dataBrand.logo.startsWith("http") ? (
                                            <img
                                                src={`${dataBrand.logo}?auto=format&fit=crop&w=120&q=80`}
                                                alt={dataBrand.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <span>{initials}</span>
                                        )}
                                    </div>

                                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100/60 mt-4">
                                        👑 Đối tác VIP
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <h3 className="font-extrabold text-gray-900 text-lg line-clamp-1 group-hover:text-purple-600 transition-colors">
                                        {dataBrand.name || "Thương hiệu Ẩm thực"}
                                    </h3>

                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                        {dataBrand.description || "Hệ thống nhà hàng đối tác chính thức của nền tảng đặt bàn ẩm thực NVNguyen."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* VÙNG NÚT HÀNH ĐỘNG: Rơ chuột vào đây TUYỆT ĐỐI KHÔNG LẬT THẺ để người dùng thoải mái click */}
                        <div
                            onMouseEnter={(e) => {
                                e.stopPropagation();
                                setIsFlipped(false);
                            }}
                            className="px-5 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between bg-white z-10"
                        >
                            <Link
                                href={`/brands/${dataBrand.id}`}
                                className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-800 text-xs font-bold text-center border border-purple-200/60 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                <span>✨ Khám phá thương hiệu</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>

                    {/* ==================== MẶT SAU (BACK FACE - HỒ SƠ TỔNG THỂ CHUYÊN SÂU) ==================== */}
                    <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-indigo-500/30 p-5 shadow-2xl overflow-hidden ${!isFlipped ? "pointer-events-none" : ""}`}>
                        {/* Hào quang nền mặt sau */}
                        <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

                        <div className="flex flex-col gap-2.5 relative z-10 flex-1 overflow-hidden">
                            {/* Tiêu đề mặt sau */}
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                                    <FaBuilding className="text-purple-400" /> Hồ Sơ Thương Hiệu
                                </span>
                                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                                    <FaCheckCircle className="text-[9px]" /> {dataBrand.isActive === "ACTIVE" ? "Đã xác thực" : "Hợp tác chính thức"}
                                </span>
                            </div>

                            <h4 className="font-extrabold text-base text-white line-clamp-1">
                                {dataBrand.name}
                            </h4>

                            {/* Mô tả từ mặt trước hiển thị ở mặt sau để không bị mất ngữ cảnh */}
                            {dataBrand.description && (
                                <p className="text-[11px] text-slate-300 line-clamp-2 italic bg-white/5 p-2 rounded-lg border border-white/5">
                                    "{dataBrand.description}"
                                </p>
                            )}

                            {/* Danh sách thông tin chi tiết toàn diện từ mặt trước + DB */}
                            <div className="flex flex-col gap-2 text-xs text-slate-300 max-h-[175px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-indigo-500/30 hover:[&::-webkit-scrollbar-thumb]:bg-indigo-500/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                                <div className="flex items-start gap-2 py-0.5 border-b border-white/5">
                                    <FaMapMarkerAlt className="text-rose-400 mt-0.5 flex-shrink-0" />
                                    <span className="line-clamp-2">
                                        <strong className="text-white">Trụ sở:</strong> {formatAddress(dataBrand.address)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <MdStorefront className="text-purple-400 text-sm" /> Quy mô hệ thống:
                                    </span>
                                    <strong className="text-white">{totalRestaurants} cơ sở nhà hàng</strong>
                                </div>

                                <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <FaPhoneAlt className="text-emerald-400" /> Hotline:
                                    </span>
                                    <strong className="text-white truncate max-w-[150px]">{dataBrand.phoneContact || "Đang cập nhật"}</strong>
                                </div>

                                <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <FaEnvelope className="text-amber-400" /> Email:
                                    </span>
                                    <strong className="text-white truncate max-w-[150px]">{dataBrand.emailContact || "Đang cập nhật"}</strong>
                                </div>

                                <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <FaGlobe className="text-cyan-400" /> Website:
                                    </span>
                                    <strong className="text-white truncate max-w-[150px]">{dataBrand.link || "Đang cập nhật"}</strong>
                                </div>

                                <div className="flex items-center justify-between py-0.5">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <FaCalendarAlt className="text-purple-400" /> Gia nhập NVNguyen:
                                    </span>
                                    <strong className="text-white">{formatDate(dataBrand.createdAt)}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Footer nút điều hướng ở mặt sau, rơ chuột vào đây không bị lật ngược */}
                        <div
                            onMouseEnter={(e) => e.stopPropagation()}
                            className="pt-2.5 border-t border-white/10 relative z-10 flex items-center justify-between"
                        >
                            <Link
                                href={`/brands/${dataBrand.id}`}
                                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold text-center shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center gap-1.5"
                            >
                                <span>Xem trang chủ thương hiệu</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};

export default Brand_Card_Components;