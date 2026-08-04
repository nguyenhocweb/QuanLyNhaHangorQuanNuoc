"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RestaurantCardType } from "@/src/features/public/restaurant/restaurant_type/restaurant_card_type";
import FadeIn from "@/src/core/components/animation/FadeIn";
import AutoItemCarousel from "@/src/core/components/animation/AutoItemCarousel";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineAccessTimeFilled, MdStorefront } from "react-icons/md";
import { FaStar, FaFire, FaUsers, FaCalendarCheck, FaClock, FaPhoneAlt, FaEnvelope, FaMoneyBillWave, FaUtensils, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

const formatAddress = (address: any): string => {
    if (!address) return "Địa chỉ đang cập nhật";
    if (typeof address === "string") return address;
    if (typeof address === "object" && address !== null) {
        return [address.street, address.ward, address.district, address.province]
            .filter(Boolean)
            .join(", ") || "Hệ thống nhà hàng NVNguyen";
    }
    return "Hệ thống nhà hàng NVNguyen";
};

const formatCurrency = (amount?: number): string => {
    if (amount === undefined || amount === null) return "Theo quy định";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const Card_Restaurant_Component = ({
    dataRestaurant,
    index
}: {
    dataRestaurant: RestaurantCardType;
    index: number;
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const isClosed = dataRestaurant.time === "Hôm nay nghỉ" || !dataRestaurant.time;

    return (
        <FadeIn delay={(index % 6) * 0.1} className="w-full h-full">
            {/* Container chính group có chiều cao cố định để lật 3D không bị biến dạng */}
            <div
                className="w-full h-[460px] [perspective:1000px] group cursor-default"
                onMouseLeave={() => setIsFlipped(false)}
            >
                {/* Thẻ 3D chứa mặt trước và mặt sau */}
                <div
                    className={`w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] ${
                        isFlipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
                >
                    {/* ==================== MẶT TRƯỚC (FRONT FACE) ==================== */}
                    <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] flex flex-col justify-between bg-white rounded-2xl border border-gray-100/80 shadow-sm transition-all duration-300 overflow-hidden ${isFlipped ? "pointer-events-none" : "hover:shadow-xl"}`}>
                        
                        {/* VÙNG KÍCH HOẠT LẬT THẺ: Rơ chuột vào hình ảnh hay thông tin quán SẼ LẬT THẺ */}
                        <div
                            onMouseEnter={() => setIsFlipped(true)}
                            className="flex-1 flex flex-col cursor-pointer"
                        >
                            {/* Phần Header Hình ảnh & Huy hiệu nổi */}
                            <div className="relative w-full h-56 overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                    src={`${dataRestaurant.imageMain}?auto=format&fit=crop&w=800&q=80`}
                                    alt={dataRestaurant.name || "Nhà hàng NVNguyen"}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-60" />

                                {/* Huy hiệu Mới hoặc Nổi bật bên Trái */}
                                {dataRestaurant.isNew ? (
                                    <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 animate-pulse">
                                        <FaFire className="text-amber-300" />
                                        <span>Mới ra mắt</span>
                                    </div>
                                ) : (
                                    <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                                        <FaHeart className="text-rose-300 text-[10px]" /> Yêu thích
                                    </div>
                                )}

                                {/* Huy hiệu Điểm đánh giá bên Phải */}
                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-gray-900 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-gray-100">
                                    <FaStar className="text-amber-400 text-sm" />
                                    <span>{Number(dataRestaurant.averageRating || 4.9).toFixed(1)}</span>
                                </div>

                                {/* Nhãn Thương hiệu */}
                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold drop-shadow-md">
                                    <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg truncate max-w-[100%]">
                                        <MdStorefront className="text-emerald-400 flex-shrink-0 text-sm" />
                                        <span className="truncate">{dataRestaurant.brandName || "Thương hiệu Đối tác"}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Phần Nội dung Thông tin Chi tiết */}
                            <div className="p-5 pt-4 flex flex-col justify-between flex-1 gap-1.5 relative">
                                <h3 className="font-extrabold text-gray-900 text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                    {dataRestaurant.name || "Nhà hàng Cao cấp"}
                                </h3>

                                {/* Danh sách thể loại ẩm thực tự động chạy (Carousel) với màu từ DB */}
                                {dataRestaurant.categories && dataRestaurant.categories.length > 0 && (
                                    <div className="w-full my-0.5">
                                        <AutoItemCarousel
                                            items={dataRestaurant.categories.map((cat, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="px-2.5 py-1 rounded-md text-[10px] font-bold shadow-sm whitespace-nowrap"
                                                    style={{ 
                                                        backgroundColor: cat.bgColor || '#EEF2FF', 
                                                        color: cat.textColor || '#4f46e5' 
                                                    }}
                                                >
                                                    {cat.name}
                                                </span>
                                            ))}
                                            interval={15}
                                            className="w-full h-6"
                                        />
                                    </div>
                                )}

                                <div className="flex items-start gap-2 text-xs text-gray-500 mt-1">
                                    <FaLocationDot className="text-red-500 flex-shrink-0 mt-0.5 text-sm" />
                                    <span className="line-clamp-2 leading-relaxed">
                                        {formatAddress(dataRestaurant.address)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-medium pt-1 mt-auto">
                                    <MdOutlineAccessTimeFilled className="text-indigo-500 flex-shrink-0 text-sm" />
                                    <span className={isClosed ? "text-rose-500 font-bold" : "text-gray-700"}>
                                        {dataRestaurant.time || "08:00 - 22:00"}
                                    </span>
                                    {!isClosed && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60 ml-auto">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                            Đang mở
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* VÙNG NÚT HÀNH ĐỘNG: Rơ chuột vào đây TUYỆT ĐỐI KHÔNG LẬT THẺ để người dùng thoải mái click */}
                        <div
                            onMouseEnter={(e) => {
                                e.stopPropagation();
                                setIsFlipped(false);
                            }}
                            className="px-5 pb-4 pt-2.5 border-t border-gray-100 flex items-center gap-2.5 bg-white z-10"
                        >
                            <Link
                                href={`/restaurants/${dataRestaurant.id}`}
                                className="flex-1 block py-2.5 px-2 rounded-xl bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 text-xs font-bold text-center border border-gray-200/60 transition-all duration-200 shadow-sm"
                            >
                                ✨ Xem 3D &rarr;
                            </Link>
                            
                            <Link
                                href={`/restaurants/${dataRestaurant.id}?booking=true`}
                                className="flex-1 py-2.5 px-2 rounded-xl bg-gradient-to-r from-gray-900 to-black hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-bold text-center shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-1"
                            >
                                <span>🍽️ Đặt bàn</span>
                            </Link>
                        </div>
                    </div>

                    {/* ==================== MẶT SAU (BACK FACE - HỒ SƠ TỔNG THỂ CHUYÊN SÂU TỪ DB) ==================== */}
                    <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-indigo-500/30 p-5 shadow-2xl overflow-hidden ${!isFlipped ? "pointer-events-none" : ""}`}>
                        {/* Hào quang nền mặt sau */}
                        <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

                        <div className="flex flex-col gap-2.5 relative z-10 flex-1 overflow-hidden">
                            {/* Tiêu đề mặt sau */}
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                                    <MdStorefront className="text-indigo-400 text-lg" /> {dataRestaurant.brandName || "Hệ thống NVNguyen"}
                                </span>
                                <span className="text-[10px] font-semibold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
                                    <FaStar className="text-[9px] text-amber-400" /> {Number(dataRestaurant.averageRating || 0).toFixed(1)}
                                </span>
                            </div>

                            <h4 className="font-extrabold text-base text-white line-clamp-1">
                                {dataRestaurant.name}
                            </h4>

                            {/* Danh sách thông tin chi tiết toàn diện từ mặt trước + DB */}
                            <div className="flex flex-col gap-1.5 text-xs text-slate-300 max-h-[280px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-indigo-500/30 hover:[&::-webkit-scrollbar-thumb]:bg-indigo-500/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                                
                                {/* Địa chỉ & Giờ mở cửa từ mặt trước */}
                                <div className="flex items-start gap-2 py-0.5 border-b border-white/5">
                                    <FaMapMarkerAlt className="text-rose-400 mt-0.5 flex-shrink-0" />
                                    <span className="line-clamp-2">
                                        <strong className="text-white">Địa chỉ:</strong> {formatAddress(dataRestaurant.address)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <MdOutlineAccessTimeFilled className="text-cyan-400 text-sm" /> Giờ mở cửa:
                                    </span>
                                    <strong className="text-white">{dataRestaurant.time}</strong>
                                </div>

                                {/* Điểm đánh giá thành phần */}
                                {dataRestaurant.totalRating ? (
                                    <div className="py-1.5 border-b border-white/5 flex flex-col gap-1">
                                        <span className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                                            <FaStar className="text-amber-400" /> Chi tiết đánh giá ({dataRestaurant.totalRating} lượt):
                                        </span>
                                        <div className="flex items-center justify-between px-2">
                                            <span>Đồ ăn: <strong className="text-amber-300">{Number(dataRestaurant.average_food_rating || 5).toFixed(1)}</strong></span>
                                            <span>Phục vụ: <strong className="text-emerald-300">{Number(dataRestaurant.average_service_rating || 5).toFixed(1)}</strong></span>
                                            <span>Không gian: <strong className="text-indigo-300">{Number(dataRestaurant.average_ambiance_rating || 5).toFixed(1)}</strong></span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-0.5 border-b border-white/5 flex items-center gap-1.5 text-slate-400">
                                        <FaStar className="text-amber-400" /> Chưa có đánh giá chi tiết
                                    </div>
                                )}

                                {/* Các chỉ số sức chứa & quy định */}
                                <div className="flex items-center justify-between py-0.5 border-b border-white/5 mt-1">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <FaUsers className="text-indigo-400" /> Sức chứa tối đa:
                                    </span>
                                    <strong className="text-white">
                                        {dataRestaurant.max_party_size ? `${dataRestaurant.max_party_size} khách` : "Đang cập nhật"}
                                    </strong>
                                </div>

                                <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <FaCalendarCheck className="text-emerald-400" /> Đặt trước tối đa:
                                    </span>
                                    <strong className="text-white">
                                        {dataRestaurant.booking_window_days ? `${dataRestaurant.booking_window_days} ngày` : "Theo quy định"}
                                    </strong>
                                </div>

                                <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <FaMoneyBillWave className="text-rose-400" /> Yêu cầu cọc:
                                    </span>
                                    <strong className="text-white text-right">
                                        {dataRestaurant.deposit_required
                                            ? dataRestaurant.deposit_amount
                                                ? formatCurrency(dataRestaurant.deposit_amount)
                                                : "Có yêu cầu"
                                            : "Không yêu cầu"}
                                    </strong>
                                </div>

                                {/* Thông tin liên hệ */}
                                {dataRestaurant.phone_contact && (
                                    <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                                        <span className="flex items-center gap-1.5 text-slate-400">
                                            <FaPhoneAlt className="text-cyan-400" /> Hotline:
                                        </span>
                                        <strong className="text-white truncate max-w-[150px]">{dataRestaurant.phone_contact}</strong>
                                    </div>
                                )}
                                
                                {dataRestaurant.description && (
                                    <div className="mt-1 pb-1">
                                        <span className="text-slate-400 flex items-center gap-1.5 mb-1"><FaUtensils className="text-rose-400"/> Giới thiệu:</span>
                                        <p className="text-[10px] text-slate-300 line-clamp-3 italic bg-white/5 p-2 rounded-lg border border-white/5 leading-relaxed">
                                            "{dataRestaurant.description}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer nút điều hướng ở mặt sau, rơ chuột vào đây không bị lật ngược */}
                        <div
                            onMouseEnter={(e) => e.stopPropagation()}
                            className="pt-2.5 border-t border-white/10 relative z-10 flex items-center gap-2"
                        >
                            <Link
                                href={`/restaurants/${dataRestaurant.id}`}
                                className="flex-1 py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-center border border-white/10 transition-all duration-200"
                            >
                                Xem 3D
                            </Link>
                            <Link
                                href={`/restaurants/${dataRestaurant.id}?booking=true`}
                                className="flex-1 py-2 px-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold text-center shadow-lg transition-all duration-200"
                            >
                                🍽️ Đặt bàn
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};

export default Card_Restaurant_Component;