"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPromotionSchema, CreatePromotionFormValues } from '../schema/promotion.schema';
import { useCreatePromotion } from '../hook/useCreatePromotion';
import { Button, Div, H } from '@/src/core/components/ui';
import { FiX } from 'react-icons/fi';

interface CreatePromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    brandId: string;
}

const CreatePromotionModal: React.FC<CreatePromotionModalProps> = ({ isOpen, onClose, brandId }) => {
    const { mutate: createPromotion, isPending } = useCreatePromotion();

    const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm<CreatePromotionFormValues>({
        resolver: zodResolver(createPromotionSchema),
        defaultValues: {
            code: '',
            discount_type: 'PERCENTAGE',
            discount_value: 0,
            valid_from: '',
            valid_until: '',
            isActive: true,
        }
    });

    const discountType = watch('discount_type');

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let randomCode = '';
        for (let i = 0; i < 8; i++) {
            randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setValue('code', randomCode, { shouldValidate: true });
    };

    const onSubmit = (data: CreatePromotionFormValues) => {
        createPromotion({ brandId, payload: data }, {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                <Div vitri="row_between" className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <H level={3} className="text-xl font-bold text-gray-800">Tạo Khuyến Mãi Mới</H>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiX className="text-xl text-gray-500" />
                    </button>
                </Div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Mã khuyến mãi <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                <input 
                                    {...register('code')} 
                                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    placeholder="VD: SALE50..."
                                />
                                <button 
                                    type="button"
                                    onClick={generateRandomCode}
                                    className="whitespace-nowrap px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                                >
                                    Ngẫu nhiên
                                </button>
                            </div>
                            {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Loại giảm giá <span className="text-red-500">*</span></label>
                            <select 
                                {...register('discount_type')}
                                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                            >
                                <option value="PERCENTAGE">Giảm theo %</option>
                                <option value="FIXED_AMOUNT">Giảm tiền mặt</option>
                            </select>
                            {errors.discount_type && <p className="text-xs text-red-500">{errors.discount_type.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Mức giảm <span className="text-red-500">*</span></label>
                            <input 
                                type="number"
                                {...register('discount_value', { valueAsNumber: true })} 
                                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                placeholder={discountType === 'PERCENTAGE' ? "VD: 10 (%)" : "VD: 50000 (VNĐ)"}
                            />
                            {errors.discount_value && <p className="text-xs text-red-500">{errors.discount_value.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Đơn hàng tối thiểu</label>
                            <input 
                                type="number"
                                {...register('min_order_value', { valueAsNumber: true })} 
                                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                placeholder="VD: 100000"
                            />
                            {errors.min_order_value && <p className="text-xs text-red-500">{errors.min_order_value.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Giảm tối đa (Nếu chọn %)</label>
                            <input 
                                type="number"
                                {...register('max_discount', { valueAsNumber: true })} 
                                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                placeholder="VD: 30000"
                            />
                            {errors.max_discount && <p className="text-xs text-red-500">{errors.max_discount.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Giới hạn số lượt dùng</label>
                            <input 
                                type="number"
                                {...register('usage_limit', { valueAsNumber: true })} 
                                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                placeholder="VD: 100"
                            />
                            {errors.usage_limit && <p className="text-xs text-red-500">{errors.usage_limit.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Từ ngày <span className="text-red-500">*</span></label>
                            <input 
                                type="datetime-local"
                                {...register('valid_from')} 
                                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                            />
                            {errors.valid_from && <p className="text-xs text-red-500">{errors.valid_from.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Đến ngày <span className="text-red-500">*</span></label>
                            <input 
                                type="datetime-local"
                                {...register('valid_until')} 
                                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                            />
                            {errors.valid_until && <p className="text-xs text-red-500">{errors.valid_until.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Mô tả chi tiết</label>
                        <textarea 
                            {...register('description')} 
                            rows={3}
                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                            placeholder="Mô tả điều kiện áp dụng..."
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="isActive" {...register('isActive')} className="w-4 h-4 text-purple-600 rounded border-gray-300" />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Kích hoạt ngay</label>
                    </div>

                    <Div vitri="row_end" className="gap-3 pt-4 border-t border-gray-100">
                        <Button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
                            Hủy bỏ
                        </Button>
                        <Button type="submit" disabled={isPending} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm transition-all disabled:opacity-50">
                            {isPending ? "Đang lưu..." : "Lưu Khuyến Mãi"}
                        </Button>
                    </Div>
                </form>
            </div>
        </div>
    );
};

export default CreatePromotionModal;
