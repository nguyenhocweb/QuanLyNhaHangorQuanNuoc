"use client";

import React, { useState } from 'react';
import { useGetMyBrand } from '../hook/useGetMyBrand';
import { useGetMyBrandRestaurants } from '../hook/useGetMyBrandRestaurants';
import { useGetMyBrandSubscription } from '../hook/useGetMyBrandSubscription';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { FiCheckCircle } from 'react-icons/fi';
import { BiBuildingHouse } from 'react-icons/bi';
import UpdateMyBrandModal from './UpdateMyBrandModal';
import AutoImageCarousel from '@/src/core/components/animation/AutoImageCarousel';
import MyBrandSubscription from './MyBrandSubscription';
import MyBrandRestaurants from './MyBrandRestaurants';

const MyBrandView = () => {
    const { data: brand, isLoading: isBrandLoading, isError: isBrandError } = useGetMyBrand();
    const { data: restaurants, isLoading: isRestaurantsLoading } = useGetMyBrandRestaurants();
    const { data: subscription, isLoading: isSubscriptionLoading } = useGetMyBrandSubscription();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    if (isBrandLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isBrandError || !brand) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
                <BiBuildingHouse className="text-6xl text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700">Không tìm thấy thương hiệu</h3>
                <p>Vui lòng thử lại sau hoặc liên hệ quản trị viên.</p>
            </div>
        );
    }

    return (
        <FadeIn className="w-full max-w-[1600px] mx-auto space-y-6 md:space-y-8">
            {/* Header Section */}
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-100">
                <div className="h-72 md:h-96 lg:h-[400px] w-full bg-slate-200 relative group">
                    <AutoImageCarousel 
                        images={[brand.imageMain, ...(brand.images || [])].filter(Boolean) as string[]} 
                        interval={4000}
                        alt="Brand Cover"
                    />
                </div>

                <div className="px-8 pb-8 flex flex-col md:flex-row gap-6 items-start -mt-16 relative z-10">
                    <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-xl shrink-0 border border-slate-100">
                        {brand.logo ? (
                            <img src={brand.logo} alt="Brand Logo" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <div className="w-full h-full bg-blue-50 rounded-xl flex items-center justify-center">
                                <BiBuildingHouse className="text-4xl text-blue-300" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 mt-4 md:mt-16 flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-slate-800">{brand.name}</h1>
                                {brand.isFeatured && (
                                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                        <FiCheckCircle />
                                        Tiêu biểu
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-500 font-medium mb-3">Trạng thái: <span className="text-green-600">Đang hoạt động</span></p>
                            
                            {/* Quick Stats */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold border border-slate-100 shadow-sm transition-all hover:bg-slate-100">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" className="text-blue-500" xmlns="http://www.w3.org/2000/svg"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                    {brand._count?.restaurants || brand.restaurantCount || 0} Chi nhánh
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold border border-slate-100 shadow-sm transition-all hover:bg-slate-100">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" className="text-emerald-500" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    {brand._count?.employments || brand.employments?.length || 0} Nhân sự
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsUpdateModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Cập nhật thông tin
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Contact Info */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BiBuildingHouse className="text-blue-500" />
                        Thông tin liên hệ
                    </h3>

                    <div className="space-y-5">
                        <div className="flex gap-3 items-start">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Số điện thoại</p>
                                <p className="font-medium text-slate-800">{brand.phoneContact || <span className="text-slate-400 italic cursor-pointer hover:text-blue-500" onClick={() => setIsUpdateModalOpen(true)}>+ Thêm số điện thoại</span>}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Email</p>
                                <p className="font-medium text-slate-800">{brand.emailContact || <span className="text-slate-400 italic cursor-pointer hover:text-blue-500" onClick={() => setIsUpdateModalOpen(true)}>+ Thêm email</span>}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Website</p>
                                <p className="font-medium text-blue-600">
                                    {brand.link ? (
                                        <a href={brand.link} target="_blank" rel="noreferrer" className="hover:underline">{brand.link}</a>
                                    ) : <span className="text-slate-400 italic cursor-pointer hover:text-blue-500" onClick={() => setIsUpdateModalOpen(true)}>+ Thêm website</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal & Address */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" className="text-slate-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            Thông tin pháp lý
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Mã số thuế</p>
                                    <p className="font-semibold text-slate-800 text-base">{brand.taxCode || <span className="text-slate-400 italic cursor-pointer hover:text-blue-500 font-normal" onClick={() => setIsUpdateModalOpen(true)}>+ Thêm mã số thuế</span>}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Địa chỉ đăng ký kinh doanh</p>
                                    <p className="font-medium text-slate-800 text-sm mt-1">
                                        {brand.address ? `${brand.address.street}, ${brand.address.ward}, ${brand.address.district}, ${brand.address.province}` : <span className="text-slate-400 italic cursor-pointer hover:text-blue-500 font-normal" onClick={() => setIsUpdateModalOpen(true)}>+ Cập nhật địa chỉ</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tax & Service Configuration */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" className="text-amber-500"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            Cấu hình Thuế & Phí
                        </h3>
                        
                        <div className="space-y-4">
                            {/* VAT Config */}
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                <div>
                                    <p className="font-medium text-slate-700 text-sm">Giá bán</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{brand.isVatInclusive ? "Đã bao gồm thuế VAT" : "Chưa bao gồm thuế VAT"}</p>
                                </div>
                                <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold">
                                    VAT {brand.defaultVatRate}%
                                </div>
                            </div>

                            {/* Service Charge Config */}
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                <div>
                                    <p className="font-medium text-slate-700 text-sm">Phí dịch vụ</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{brand.applyServiceCharge ? "Đang áp dụng" : "Không áp dụng"}</p>
                                </div>
                                {brand.applyServiceCharge && (
                                    <div className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-sm font-semibold">
                                        Phí {brand.serviceChargeRate}%
                                    </div>
                                )}
                            </div>

                            {/* Global Override Warning */}
                            {brand.forceGlobalTaxConfig && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-2 items-start">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mt-0.5 shrink-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        Đang **ép buộc** áp dụng cấu hình thuế & phí này cho toàn bộ chi nhánh.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Inventory Configuration */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" className="text-emerald-500"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            Cấu hình Kho Hàng
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col bg-slate-50 p-4 rounded-xl">
                                <p className="font-semibold text-slate-700 text-sm mb-1">Hạn mức tự duyệt phiếu kiểm kê</p>
                                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                                    Quản lý chi nhánh được tự động duyệt các phiếu có giá trị chênh lệch (âm/dương) nằm trong khoảng hạn mức này.
                                </p>
                                <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-lg font-bold text-center border border-emerald-200">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(brand.inventoryApprovalThreshold || 0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscription Info */}
            <MyBrandSubscription 
                subscription={subscription} 
                isSubscriptionLoading={isSubscriptionLoading} 
            />

            {/* Restaurants List */}
            <MyBrandRestaurants 
                restaurants={restaurants} 
                isRestaurantsLoading={isRestaurantsLoading} 
            />

            {isUpdateModalOpen && (
                <UpdateMyBrandModal
                    brand={brand}
                    onClose={() => setIsUpdateModalOpen(false)}
                />
            )}
        </FadeIn>
    );
};

export default MyBrandView;
