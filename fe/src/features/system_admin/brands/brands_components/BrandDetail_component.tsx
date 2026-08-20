"use client"
import React from 'react';
import { useGetBrandById } from "../brands_hook/useGetBrandById_hook";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FiMapPin, FiMail, FiPhone, FiLink, FiCalendar, FiFileText, FiImage, FiArrowLeft, FiStar, FiActivity, FiUser } from "react-icons/fi";
import { MdOutlineStorefront } from "react-icons/md";
import Link from 'next/link';

const STATUS_BADGE: Record<string, { label: string, color: string }> = {
    "ACTIVE": { label: "Hoạt động", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    "PENDING": { label: "Chờ duyệt", color: "bg-amber-100 text-amber-700 border-amber-200" },
    "INACTIVE": { label: "Tạm ngưng", color: "bg-slate-100 text-slate-700 border-slate-200" },
    "TERMINATED": { label: "Chấm dứt", color: "bg-red-100 text-red-700 border-red-200" },
};

const BrandDetailComponent = ({ brandId }: { brandId: string }) => {
    const { data: brand, isLoading, error } = useGetBrandById(brandId);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 w-full">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500 font-medium">Đang tải thông tin thương hiệu...</p>
                </div>
            </div>
        );
    }

    if (error || !brand) {
        return (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center justify-center h-64 border border-red-100">
                <p className="text-lg font-semibold">Không thể tải thông tin thương hiệu</p>
                <p className="text-sm mt-2 opacity-80">Có thể thương hiệu này không tồn tại hoặc đã bị xóa.</p>
                <Link href="/system/brands" className="mt-6 px-6 py-2 bg-white text-red-600 font-medium rounded-xl shadow-sm border border-red-200 hover:bg-red-50 transition-colors">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    const statusInfo = STATUS_BADGE[brand.isActive || "PENDING"] || STATUS_BADGE["PENDING"];
    const joinDate = brand.createdAt 
        ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(brand.createdAt)) 
        : "N/A";
    const updateDate = brand.updatedAt 
        ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(brand.updatedAt)) 
        : "N/A";
    
    const fullAddress = [brand.address?.street, brand.address?.ward, brand.address?.district, brand.address?.province].filter(Boolean).join(', ') || "Chưa cập nhật địa chỉ";

    return (
        <FadeIn className="w-full max-w-7xl mx-auto space-y-6 px-4 sm:px-6 xl:px-8">
            {/* Action Bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100">
                <button onClick={() => window.history.back()} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-blue-50">
                    <FiArrowLeft /> Quay lại
                </button>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-sm hover:bg-blue-700 transition-colors">
                        Cập nhật thông tin
                    </button>
                </div>
            </div>

            {/* Header Profile */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
                <div className="h-48 w-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 relative">
                    {brand.imageMain && (
                        <img src={brand.imageMain} alt="Cover" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                    )}
                </div>
                
                <div className="px-8 pb-8 pt-0 flex flex-col md:flex-row gap-6 items-start relative -mt-16">
                    <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-lg shrink-0 border border-slate-100">
                        {brand.logo ? (
                            <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center text-4xl font-bold text-blue-600">
                                {brand.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 mt-16 md:mt-20 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{brand.name}</h1>
                                {brand.isFeatured && (
                                    <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200">
                                        <FiStar className="fill-current" /> Tiêu biểu
                                    </span>
                                )}
                                {brand.isNew && (
                                    <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold border border-blue-200">MỚI</span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 font-medium flex-wrap">
                                <span className="flex items-center gap-1.5"><FiFileText className="text-slate-400" /> MST: <span className="text-slate-700">{brand.taxCode || "N/A"}</span></span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="flex items-center gap-1.5"><FiCalendar className="text-slate-400" /> Tham gia: <span className="text-slate-700">{joinDate}</span></span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${statusInfo.color} shadow-sm flex items-center gap-2`}>
                                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                                {statusInfo.label}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Info */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FiFileText className="text-blue-500" /> Thông tin giới thiệu
                        </h3>
                        <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed">
                            {brand.description ? (
                                <p className="whitespace-pre-wrap">{brand.description}</p>
                            ) : (
                                <p className="italic text-slate-400">Chưa có thông tin mô tả chi tiết cho thương hiệu này.</p>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FiMapPin className="text-blue-500" /> Liên hệ & Địa chỉ
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0"><FiMail /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-1">Email liên hệ</p>
                                        <p className="text-sm font-semibold text-slate-700 break-all">{brand.emailContact || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-green-50 text-green-600 rounded-xl shrink-0"><FiPhone /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-1">Số điện thoại</p>
                                        <p className="text-sm font-semibold text-slate-700">{brand.phoneContact || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0"><FiLink /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-1">Website</p>
                                        {brand.link ? (
                                            <a href={brand.link.startsWith('http') ? brand.link : `https://${brand.link}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 hover:underline break-all">
                                                {brand.link}
                                            </a>
                                        ) : (
                                            <p className="text-sm font-semibold text-slate-700">N/A</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0"><FiMapPin /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-1">Địa chỉ trụ sở</p>
                                        <p className="text-sm font-semibold text-slate-700">{fullAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Gallery */}
                    {brand.images && brand.images.length > 0 && (
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <FiImage className="text-blue-500" /> Thư viện hình ảnh
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {brand.images.map((img, idx) => (
                                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative group cursor-pointer">
                                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Stats & Meta */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <MdOutlineStorefront className="text-9xl" />
                        </div>
                        <h3 className="text-blue-100 font-medium mb-2 relative z-10">Quy mô hệ thống</h3>
                        <div className="flex items-end gap-2 relative z-10">
                            <span className="text-5xl font-extrabold tracking-tight">{brand.restaurantCount || brand.restaurants?.length || 0}</span>
                            <span className="text-blue-100 font-medium pb-1.5">nhà hàng</span>
                        </div>
                        <div className="mt-6 pt-6 border-t border-blue-500/30 relative z-10">
                            <Link href={`/system/restaurants?brandId=${brand.id}`} className="flex items-center justify-between text-sm font-semibold hover:text-blue-200 transition-colors group">
                                Quản lý chi nhánh
                                <FiArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Subscription Card */}
                    {brand.subscriptions && brand.subscriptions.length > 0 && (
                        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 border-l-4 border-l-emerald-500">
                            <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider">Gói cước đang dùng</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-emerald-600 truncate mr-2" title={brand.subscriptions[0].plan.name}>{brand.subscriptions[0].plan.name}</span>
                                <span className="text-sm font-bold text-slate-600 shrink-0 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{brand.subscriptions[0].plan.price.toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>
                    )}

                    {/* Representative Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 border-l-4 border-l-indigo-500">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <FiUser className="text-indigo-500" /> Người đứng tên
                        </h3>
                        <div className="space-y-4">
                            {brand.employments && brand.employments.length > 0 ? (
                                brand.employments.map((emp, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        {emp.user.avatar ? (
                                            <img src={emp.user.avatar} alt={emp.user.name} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                                                {emp.user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate">{emp.user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{emp.user.email} {emp.user.sdt ? `• ${emp.user.sdt}` : ''}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 italic">Chưa có thông tin chủ sở hữu/người quản lý.</p>
                            )}
                        </div>
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Thông tin hệ thống</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <span className="text-xs font-medium text-slate-500">ID hệ thống</span>
                                <span className="text-xs font-mono font-bold text-slate-700">{brand.id}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <span className="text-xs font-medium text-slate-500">Tạo lúc</span>
                                <span className="text-xs font-bold text-slate-700">{joinDate}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-xs font-medium text-slate-500">Cập nhật cuối</span>
                                <span className="text-xs font-bold text-slate-700">{updateDate}</span>
                            </div>
                        </div>
                        
                        {brand.reason && brand.isActive !== 'ACTIVE' && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                                <p className="text-xs font-bold text-red-600 mb-1">Lý do/Ghi chú trạng thái:</p>
                                <p className="text-xs text-red-700">{brand.reason}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Restaurants Section */}
            {brand.restaurants && brand.restaurants.length > 0 && (
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mt-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <MdOutlineStorefront className="text-blue-500 text-2xl" /> Danh sách nhà hàng trực thuộc
                        </h3>
                        <Link href={`/system/restaurants?brandId=${brand.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                            Xem tất cả
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                        {brand.restaurants.map((restaurant: any) => {
                            const addressStr = restaurant.address 
                                ? [restaurant.address.street, restaurant.address.ward, restaurant.address.district, restaurant.address.province].filter(Boolean).join(', ')
                                : "Chưa cập nhật địa chỉ";
                                
                            return (
                                <Link href={`/system/restaurants/${restaurant.id}`} key={restaurant.id} className="group flex flex-col bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all hover:border-blue-200">
                                    <div className="h-36 w-full relative overflow-hidden bg-slate-200 shrink-0">
                                        {restaurant.imageMain ? (
                                            <img src={restaurant.imageMain} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Không có ảnh</div>
                                        )}
                                        {restaurant.isNew && (
                                            <span className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">MỚI</span>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 gap-2.5">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors" title={restaurant.name}>{restaurant.name}</h4>
                                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0 border border-amber-100">
                                                <FiStar className="fill-current" /> {restaurant.averageRating?.toFixed(1) || "0.0"}
                                            </span>
                                        </div>
                                        
                                        {restaurant.categories && restaurant.categories.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-0.5">
                                                {restaurant.categories.map((c: any, i: number) => (
                                                    <span key={i} className="text-[10px] font-semibold px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                                                        {c.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <div className="flex items-start gap-1.5 text-xs text-slate-500 mt-auto pt-2">
                                            <FiMapPin className="mt-0.5 shrink-0 text-slate-400" />
                                            <span className="line-clamp-2 leading-relaxed" title={addressStr}>{addressStr}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </FadeIn>
    );
};

export default BrandDetailComponent;
