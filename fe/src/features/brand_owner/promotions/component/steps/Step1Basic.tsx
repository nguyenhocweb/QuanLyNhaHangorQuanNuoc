"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CreatePromotionFormValues } from '../../schema/promotion.schema';
import { Div, H } from "@/src/core/components/ui";
import { FiTag, FiImage, FiPercent, FiDollarSign } from 'react-icons/fi';

export const Step1Basic = () => {
    const { register, watch, setValue, formState: { errors } } = useFormContext<CreatePromotionFormValues>();
    const discountType = watch('discountType');

    const generateCode = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        setValue('code', `PROMO-${randomString}`, { shouldValidate: true });
    };

    return (
        <Div vitri="col_none" className="gap-6 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Div vitri="col_none" className="gap-1 mb-4 text-center">
                <H level={3} className="text-xl font-bold text-slate-800">Thông tin cơ bản</H>
                <p className="text-slate-500 text-sm">Thiết lập mã code và loại giảm giá cho chiến dịch.</p>
            </Div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Mã khuyến mãi <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            {...register('code')}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold uppercase tracking-wider"
                            placeholder="VD: KHAI_TRUONG_2026"
                        />
                    </div>
                    <button 
                        type="button"
                        onClick={generateCode}
                        className="px-4 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Tạo ngẫu nhiên
                    </button>
                </div>
                {errors.code && <span className="text-red-500 text-xs font-medium">{errors.code.message}</span>}
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-semibold text-slate-700">Loại giảm giá <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-4">
                    <label className={`relative flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${discountType === 'PERCENTAGE' ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                        <input type="radio" value="PERCENTAGE" {...register('discountType')} className="sr-only" />
                        <FiPercent className="text-lg" />
                        <span className="font-bold">Theo %</span>
                    </label>
                    <label className={`relative flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${discountType === 'FIXED_AMOUNT' ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                        <input type="radio" value="FIXED_AMOUNT" {...register('discountType')} className="sr-only" />
                        <FiDollarSign className="text-lg" />
                        <span className="font-bold">Tiền mặt</span>
                    </label>
                </div>
                {errors.discountType && <span className="text-red-500 text-xs font-medium">{errors.discountType.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Giá trị giảm <span className="text-red-500">*</span></label>
                    <input 
                        type="number" 
                        {...register('discountValue', { valueAsNumber: true })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder={discountType === 'PERCENTAGE' ? 'VD: 10' : 'VD: 50000'}
                    />
                    {errors.discountValue && <span className="text-red-500 text-xs font-medium">{errors.discountValue.message}</span>}
                </div>
                
                {discountType === 'PERCENTAGE' && (
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                        <label className="text-sm font-semibold text-slate-700">Giảm tối đa (VNĐ)</label>
                        <input 
                            type="number" 
                            {...register('maxDiscount', { valueAsNumber: true })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            placeholder="VD: 100000"
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-semibold text-slate-700">Đơn hàng tối thiểu (VNĐ)</label>
                <input 
                    type="number" 
                    {...register('minOrderValue', { valueAsNumber: true })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="VD: 200000"
                />
            </div>
            
            <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-semibold text-slate-700">Mô tả chiến dịch</label>
                <textarea 
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                    placeholder="Nhập ghi chú hoặc mô tả nội bộ..."
                />
            </div>
        </Div>
    );
};
