"use client";

import React from "react";
import Image from "next/image";
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaCopy, FaUserTie, FaCheckCircle, FaBuilding } from "react-icons/fa";
import { toast } from "sonner";
import { usePerformanceMode } from "@/src/core/hooks/usePerformanceMode";

interface BrandDetailContactCardProps {
    data: any;
}

export default function BrandDetailContactCard({ data }: BrandDetailContactCardProps) {
    const { is3D } = usePerformanceMode();

    if (!data) return null;

    const handleCopy = (text: string, label: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`Đã sao chép ${label}: ${text}`);
    };

    const managers = data.employments || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 w-full animate-fade-in my-6">
            
            {/* 1. KHUNG THÔNG TIN LIÊN HỆ TRỰC TIẾP (QUICK CONTACTS) - CHIẾM 2/3 */}
            <div className={`lg:col-span-2 p-6 sm:p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between ${
                is3D
                    ? "bg-gradient-to-br from-indigo-950/70 via-slate-900/80 to-purple-950/70 border border-indigo-500/30 text-white shadow-xl shadow-indigo-950/50 backdrop-blur-2xl"
                    : "bg-white border border-gray-200 text-gray-800 shadow-lg shadow-gray-100"
            }`}>
                <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                                Kết nối trực tiếp
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black mt-1">
                                Cổng Thông Tin & Đặt Bàn VIP
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 font-black flex-shrink-0">
                            VIP
                        </div>
                    </div>
                    
                    <p className={`text-sm sm:text-base mb-6 ${is3D ? "text-gray-300" : "text-gray-600"}`}>
                        Thực khách và Quý đối tác có nhu cầu liên hệ đặt bàn tiệc lớn, tổ chức sự kiện đặc biệt hoặc hợp tác nhượng quyền, vui lòng liên hệ qua các kênh chính thức dưới đây của hệ thống.
                    </p>
                </div>

                {/* Danh sách nút Action */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto">
                    
                    {/* Hotline */}
                    <div className={`p-4 rounded-2xl border flex flex-col gap-3 transition-all duration-300 ${
                        is3D ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}>
                        <div className="flex items-center justify-between">
                            <span className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-lg">
                                <FaPhoneAlt />
                            </span>
                            {data.phoneContact && (
                                <button
                                    type="button"
                                    onClick={() => handleCopy(data.phoneContact, "Hotline")}
                                    className="text-xs opacity-60 hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition"
                                    title="Sao chép Hotline"
                                >
                                    <FaCopy />
                                </button>
                            )}
                        </div>
                        <div>
                            <span className="text-xs font-semibold opacity-70 block">Hotline đặt bàn</span>
                            <a
                                href={data.phoneContact ? `tel:${data.phoneContact}` : "#"}
                                className="text-base sm:text-lg font-black text-emerald-500 hover:underline truncate block mt-0.5"
                            >
                                {data.phoneContact || "0987.654.321"}
                            </a>
                        </div>
                    </div>

                    {/* Email */}
                    <div className={`p-4 rounded-2xl border flex flex-col gap-3 transition-all duration-300 ${
                        is3D ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}>
                        <div className="flex items-center justify-between">
                            <span className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center text-lg">
                                <FaEnvelope />
                            </span>
                            {data.emailContact && (
                                <button
                                    type="button"
                                    onClick={() => handleCopy(data.emailContact, "Email")}
                                    className="text-xs opacity-60 hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition"
                                    title="Sao chép Email"
                                >
                                    <FaCopy />
                                </button>
                            )}
                        </div>
                        <div>
                            <span className="text-xs font-semibold opacity-70 block">Email chính thức</span>
                            <a
                                href={data.emailContact ? `mailto:${data.emailContact}` : "#"}
                                className="text-sm sm:text-base font-bold text-blue-500 hover:underline truncate block mt-0.5"
                            >
                                {data.emailContact || "contact@brand.com"}
                            </a>
                        </div>
                    </div>

                    {/* Website */}
                    <div className={`p-4 rounded-2xl border flex flex-col gap-3 transition-all duration-300 ${
                        is3D ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}>
                        <div className="flex items-center justify-between">
                            <span className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center text-lg">
                                <FaGlobe />
                            </span>
                            {data.link && (
                                <button
                                    type="button"
                                    onClick={() => handleCopy(data.link, "Website")}
                                    className="text-xs opacity-60 hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition"
                                    title="Sao chép Link Website"
                                >
                                    <FaCopy />
                                </button>
                            )}
                        </div>
                        <div>
                            <span className="text-xs font-semibold opacity-70 block">Website thương hiệu</span>
                            <a
                                href={data.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm sm:text-base font-bold text-purple-500 hover:underline truncate block mt-0.5"
                            >
                                {data.link ? data.name : "https://nvnguyen.com"}
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            {/* 2. ĐỘI NGŨ BAN LÃNH ĐẠO (BRAND LEADERSHIP / MANAGERS) - CHIẾM 1/3 */}
            <div className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between ${
                is3D
                    ? "bg-slate-900/80 border border-purple-500/30 text-white shadow-xl shadow-purple-950/50 backdrop-blur-2xl"
                    : "bg-white border border-gray-200 text-gray-800 shadow-lg shadow-gray-100"
            }`}>
                <div>
                    <div className="flex items-center gap-2 mb-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                        <FaUserTie />
                        Ban Lãnh Đạo Thương Hiệu
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black mb-4">
                        Quản Lý Uy Tín
                    </h3>
                    <p className={`text-xs mb-6 ${is3D ? "text-gray-400" : "text-gray-500"}`}>
                        Đội ngũ quản lý thương hiệu được xác thực định danh 100% trên hệ thống NVNguyen, đảm bảo chất lượng phục vụ đồng nhất.
                    </p>
                </div>

                {/* Danh sách Quản lý thương hiệu */}
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] pr-1">
                    {managers && managers.length > 0 ? (
                        managers.map((emp: any, index: number) => {
                            const user = emp.user;
                            if (!user) return null;
                            const avatarUrl = user.avatar || null;
                            const initials = user.name ? user.name.substring(0, 2).toUpperCase() : "QL";
                            
                            return (
                                <div
                                    key={user.id || index}
                                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                                        is3D
                                            ? "bg-white/5 border-white/10 text-white"
                                            : "bg-gray-50 border-gray-200 text-gray-800"
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md overflow-hidden flex-shrink-0">
                                        {avatarUrl ? (
                                            <Image src={avatarUrl} alt={user.name} fill className="object-cover" />
                                        ) : (
                                            <span>{initials}</span>
                                        )}
                                    </div>

                                    {/* Thông tin quản lý */}
                                    <div className="flex flex-col overflow-hidden flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-sm truncate">{user.name || user.user_name || "Quản lý"}</span>
                                            <FaCheckCircle className="text-emerald-500 text-xs flex-shrink-0" title="Đã xác thực" />
                                        </div>
                                        <span className={`text-[11px] truncate ${is3D ? "text-gray-400" : "text-gray-500"}`}>
                                            {user.email || "Brand Owner"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        /* State rỗng khi chưa gán Quản lý */
                        <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border text-center ${
                            is3D ? "bg-white/5 border-white/10 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-500"
                        }`}>
                            <FaBuilding className="text-2xl text-amber-500 mb-2 opacity-70" />
                            <span className="text-xs font-semibold">Thương hiệu trực thuộc Hệ thống</span>
                            <span className="text-[10px] opacity-75 mt-0.5">Được kiểm duyệt bởi Admin NVNguyen</span>
                        </div>
                    )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-500/20 flex items-center justify-between text-[11px] opacity-75">
                    <span>Trạng thái bảo chứng:</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <FaCheckCircle /> 100% Minh Bạch
                    </span>
                </div>
            </div>

        </div>
    );
}
