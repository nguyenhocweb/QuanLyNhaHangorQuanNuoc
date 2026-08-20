"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CreatePromotionFormValues } from '../../schema/promotion.schema';
import { Div, H } from "@/src/core/components/ui";

export const Step4Budget = () => {
    const { register, watch, formState: { errors } } = useFormContext<CreatePromotionFormValues>();
    const discountType = watch('discountType');
    const discountValue = watch('discountValue') || 0;
    const maxBudget = watch('maxBudget');
    const usageLimit = watch('usageLimit');

    // Tính toán ước tính (Preview logic)
    let maxExpectedUsage = usageLimit;
    if (!usageLimit && maxBudget && discountType === 'FIXED_AMOUNT') {
        maxExpectedUsage = Math.floor(maxBudget / discountValue);
    }

    return (
        <Div vitri="col_none" className="gap-8 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Div vitri="col_none" className="gap-1 mb-2 text-center">
                <H level={3} className="text-xl font-bold text-slate-800">Ngân Sách & Hạn Mức</H>
                <p className="text-slate-500 text-sm">Quản lý rủi ro và giới hạn ngân sách chi tiêu cho chiến dịch.</p>
            </Div>

            <div className="flex flex-col gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col gap-2 relative">
                    <label className="text-sm font-semibold text-slate-700">Ngân sách tối đa (Max Budget) (VNĐ)</label>
                    <input 
                        type="number" 
                        {...register('maxBudget', { valueAsNumber: true })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-indigo-700"
                        placeholder="VD: 50,000,000"
                    />
                    <p className="text-xs text-slate-500">Chiến dịch sẽ tự động dừng khi tổng tiền KM chạm mức này.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Giới hạn tổng lượt dùng</label>
                        <input 
                            type="number" 
                            {...register('usageLimit', { valueAsNumber: true })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                            placeholder="VD: 1000"
                        />
                        <p className="text-xs text-slate-400">Số lượng mã tối đa được phát hành.</p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Giới hạn mỗi khách hàng</label>
                        <input 
                            type="number" 
                            {...register('usageLimitPerUser', { valueAsNumber: true })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                            placeholder="VD: 1"
                        />
                        <p className="text-xs text-slate-400">Mỗi khách (1 User) được xài mấy lần?</p>
                    </div>
                </div>
            </div>

            {/* Preview Card */}
            <div className="mt-4 p-6 bg-indigo-600 rounded-2xl shadow-lg text-white flex flex-col gap-4">
                <h4 className="font-bold border-b border-indigo-400/50 pb-2 flex items-center justify-between">
                    <span>Bảng Dự Toán Rủi Ro</span>
                    <span className="text-xs bg-indigo-500 px-2 py-1 rounded text-indigo-100">AI Preview</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <span className="text-indigo-200 text-sm">Loại khuyến mãi</span>
                        <span className="font-bold text-lg">{discountType === 'PERCENTAGE' ? `Giảm ${discountValue}%` : `Giảm ${discountValue.toLocaleString()}đ`}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-indigo-200 text-sm">Ước tính tối đa lượt dùng</span>
                        <span className="font-bold text-lg">{maxExpectedUsage ? maxExpectedUsage.toLocaleString() : 'Không giới hạn'}</span>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <span className="text-indigo-200 text-sm">Ngân sách trần</span>
                        <span className="font-bold text-2xl text-emerald-400">{maxBudget ? `${maxBudget.toLocaleString()} VNĐ` : 'Cảnh báo: Không giới hạn'}</span>
                    </div>
                </div>
            </div>

        </Div>
    );
};
