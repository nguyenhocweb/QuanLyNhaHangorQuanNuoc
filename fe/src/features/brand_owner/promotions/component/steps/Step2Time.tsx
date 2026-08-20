"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CreatePromotionFormValues } from '../../schema/promotion.schema';
import { Div, H } from "@/src/core/components/ui";

const DAYS_OF_WEEK = [
    { value: 'MONDAY', label: 'Thứ 2' },
    { value: 'TUESDAY', label: 'Thứ 3' },
    { value: 'WEDNESDAY', label: 'Thứ 4' },
    { value: 'THURSDAY', label: 'Thứ 5' },
    { value: 'FRIDAY', label: 'Thứ 6' },
    { value: 'SATURDAY', label: 'Thứ 7' },
    { value: 'SUNDAY', label: 'CN' },
];

export const Step2Time = () => {
    const { register, watch, setValue, formState: { errors } } = useFormContext<CreatePromotionFormValues>();
    const selectedDays = watch('daysOfWeek') || [];

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day as any)) {
            setValue('daysOfWeek', selectedDays.filter(d => d !== day) as any, { shouldValidate: true });
        } else {
            setValue('daysOfWeek', [...selectedDays, day] as any, { shouldValidate: true });
        }
    };

    const toggleAllDays = () => {
        if (selectedDays.length === 7) {
            setValue('daysOfWeek', [], { shouldValidate: true });
        } else {
            setValue('daysOfWeek', DAYS_OF_WEEK.map(d => d.value) as any, { shouldValidate: true });
        }
    };

    return (
        <Div vitri="col_none" className="gap-8 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Div vitri="col_none" className="gap-1 mb-2 text-center">
                <H level={3} className="text-xl font-bold text-slate-800">Lịch Trình & Thời Gian</H>
                <p className="text-slate-500 text-sm">Thiết lập thời gian áp dụng của chiến dịch.</p>
            </Div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Ngày bắt đầu <span className="text-red-500">*</span></label>
                    <input 
                        type="datetime-local" 
                        {...register('validFrom')}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                    />
                    {errors.validFrom && <span className="text-red-500 text-xs font-medium">{errors.validFrom.message}</span>}
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Ngày kết thúc <span className="text-red-500">*</span></label>
                    <input 
                        type="datetime-local" 
                        {...register('validUntil')}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                    />
                    {errors.validUntil && <span className="text-red-500 text-xs font-medium">{errors.validUntil.message}</span>}
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-2 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Áp dụng vào các ngày trong tuần</label>
                    <button 
                        type="button" 
                        onClick={toggleAllDays}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        {selectedDays.length === 7 ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => {
                        const isSelected = selectedDays.includes(day.value as any);
                        return (
                            <button
                                key={day.value}
                                type="button"
                                onClick={() => toggleDay(day.value)}
                                className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                    isSelected 
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 -translate-y-1' 
                                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300'
                                }`}
                            >
                                {day.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Khung giờ bắt đầu (Tùy chọn)</label>
                    <input 
                        type="time" 
                        {...register('timeStart')}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                    />
                    <p className="text-xs text-slate-400">VD: 14:00 (Áp dụng khung giờ Vàng)</p>
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Khung giờ kết thúc (Tùy chọn)</label>
                    <input 
                        type="time" 
                        {...register('timeEnd')}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                    />
                    <p className="text-xs text-slate-400">VD: 17:00</p>
                </div>
            </div>

        </Div>
    );
};
