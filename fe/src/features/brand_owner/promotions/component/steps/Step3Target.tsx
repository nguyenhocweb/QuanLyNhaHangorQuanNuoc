"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CreatePromotionFormValues } from '../../schema/promotion.schema';
import { Div, H } from "@/src/core/components/ui";
import { FiUsers, FiMapPin, FiCoffee, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useGetRestaurants } from '@/src/features/brand_owner/restaurants/hook/useGetRestaurants';
import { useGetMenuItems } from '@/src/features/brand_owner/menus/hook/useMenuItem';

export const Step3Target = () => {
    const { register, watch, setValue } = useFormContext<CreatePromotionFormValues>();
    const targetAudience = watch('targetAudience') || 'ALL';
    const restaurantIds = watch('restaurantIds') || [];
    const menuItemIds = watch('menuItemIds') || [];

    const { user } = useAuthStore();
    const brandId = user?.brand?.[0]?.id || "";

    const { data: restaurantsData } = useGetRestaurants(brandId);
    const restaurants = restaurantsData || [];

    const { data: menuItemsResponse } = useGetMenuItems({ page: 1, limit: 1000 });
    const menuItems = menuItemsResponse?.metadata?.data || [];

    const toggleRestaurant = (id: string) => {
        if (restaurantIds.includes(id)) {
            setValue('restaurantIds', restaurantIds.filter(r => r !== id), { shouldValidate: true });
        } else {
            setValue('restaurantIds', [...restaurantIds, id], { shouldValidate: true });
        }
    };

    const toggleMenuItem = (id: string) => {
        if (menuItemIds.includes(id)) {
            setValue('menuItemIds', menuItemIds.filter(m => m !== id), { shouldValidate: true });
        } else {
            setValue('menuItemIds', [...menuItemIds, id], { shouldValidate: true });
        }
    };

    return (
        <Div vitri="col_none" className="gap-8 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Div vitri="col_none" className="gap-1 mb-2 text-center">
                <H level={3} className="text-xl font-bold text-slate-800">Đối Tượng & Phạm Vi</H>
                <p className="text-slate-500 text-sm">Thiết lập những ai, ở đâu và món nào được phép dùng mã.</p>
            </Div>

            <div className="flex flex-col gap-4">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FiUsers className="text-indigo-500" /> Nhóm Khách Hàng
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {['ALL', 'NEW_CUSTOMER', 'VIP', 'STUDENT'].map((audience) => (
                        <label 
                            key={audience}
                            className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                targetAudience === audience ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <input type="radio" value={audience} {...register('targetAudience')} className="sr-only" />
                            <span className="font-bold text-sm">
                                {audience === 'ALL' ? 'Tất cả (Public)' : audience === 'NEW_CUSTOMER' ? 'Khách Mới' : audience === 'VIP' ? 'Khách VIP' : 'Học sinh / SV'}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
                <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-2"><FiMapPin className="text-indigo-500" /> Chi Nhánh Áp Dụng</span>
                    <span className="text-xs font-normal text-slate-400">Không chọn = Áp dụng toàn chuỗi</span>
                </label>
                <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 max-h-60 overflow-y-auto">
                    {restaurants.map((res: any) => (
                        <button
                            key={res.id}
                            type="button"
                            onClick={() => toggleRestaurant(res.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                restaurantIds.includes(res.id) ? 'bg-white border-indigo-500 shadow-sm' : 'bg-white/50 border-transparent hover:bg-white'
                            }`}
                        >
                            <div className={`text-xl ${restaurantIds.includes(res.id) ? 'text-indigo-600' : 'text-slate-300'}`}>
                                {restaurantIds.includes(res.id) ? <FiCheckSquare /> : <FiSquare />}
                            </div>
                            <span className={`font-medium text-sm ${restaurantIds.includes(res.id) ? 'text-slate-800' : 'text-slate-600'}`}>
                                {res.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-2"><FiCoffee className="text-indigo-500" /> Món Ăn Áp Dụng (Tùy chọn)</span>
                    <span className="text-xs font-normal text-slate-400">Không chọn = Áp dụng toàn Menu</span>
                </label>
                <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 max-h-60 overflow-y-auto">
                    {menuItems.map((item: any) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleMenuItem(item.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                menuItemIds.includes(item.id) ? 'bg-white border-indigo-500 shadow-sm' : 'bg-white/50 border-transparent hover:bg-white'
                            }`}
                        >
                            <div className={`text-xl ${menuItemIds.includes(item.id) ? 'text-indigo-600' : 'text-slate-300'}`}>
                                {menuItemIds.includes(item.id) ? <FiCheckSquare /> : <FiSquare />}
                            </div>
                            <span className={`font-medium text-sm ${menuItemIds.includes(item.id) ? 'text-slate-800' : 'text-slate-600'}`}>
                                {item.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

        </Div>
    );
};
