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
                            <p className="text-slate-500 font-medium">Trạng thái: <span className="text-green-600">Đang hoạt động</span></p>
                        </div>

                        <button
                            onClick={() => setIsUpdateModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Cập nhật thông tin
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BiBuildingHouse className="text-blue-500" />
                        Thông tin liên hệ
                    </h3>

                    <div className="space-y-5">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Số điện thoại</p>
                                <p className="font-medium text-slate-800">{brand.phone_contact || "Chưa cập nhật"}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Email</p>
                                <p className="font-medium text-slate-800">{brand.email_contact || "Chưa cập nhật"}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Website</p>
                                <p className="font-medium text-blue-600">
                                    {brand.link ? (
                                        <a href={brand.link} target="_blank" rel="noreferrer" className="hover:underline">{brand.link}</a>
                                    ) : "Chưa cập nhật"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal & Address */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" className="text-blue-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            Thông tin pháp lý
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500">Mã số thuế</p>
                                <p className="font-semibold text-slate-800 text-lg">{brand.tax_code || "Chưa cập nhật"}</p>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-sm text-slate-500 flex items-center gap-1 mb-1">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    Địa chỉ đăng ký kinh doanh
                                </p>
                                <p className="font-medium text-slate-800">
                                    {brand.address ? `${brand.address.street}, ${brand.address.ward}, ${brand.address.district}, ${brand.address.province}` : "Chưa cập nhật"}
                                </p>
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
