import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiX, FiCheck } from 'react-icons/fi';
import { subscriptionSchema, SubscriptionFormValues } from '../schema/subscription-schema';
import { useCreateSubscription, useGetSubscriptionFeatures } from '../hook/useSubscription_hook';

interface CreateSubscriptionFormProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateSubscriptionForm: React.FC<CreateSubscriptionFormProps> = ({ onClose, onSuccess }) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SubscriptionFormValues>({
        resolver: zodResolver(subscriptionSchema) as any,
        defaultValues: {
            isActive: true,
            features: [],
            billingCycle: 'MONTHLY'
        }
    });

    const features = watch('features') || [];
    const isActive = watch('isActive');

    const toggleFeature = (featureKey: string) => {
        if (features.includes(featureKey)) {
            setValue('features', features.filter(item => item !== featureKey), { shouldValidate: true });
        } else {
            setValue('features', [...features, featureKey], { shouldValidate: true });
        }
    };

    const { mutate: createSubscription, isPending } = useCreateSubscription();
    const { data: featureResponse } = useGetSubscriptionFeatures();
    const featureNames = featureResponse?.data || {};

    const onSubmit = (data: SubscriptionFormValues) => {
        createSubscription(data, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 overflow-y-auto p-4 sm:p-10">
            <div className="bg-white flex flex-col relative p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-[800px] border border-gray-100 my-auto">
                <button onClick={onClose} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all" type="button">
                    <FiX className="text-xl" />
                </button>

                <div className="mb-8 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Thêm Gói Cước Mới</h2>
                    <p className="text-gray-500 text-sm mt-1.5">Tạo các gói dịch vụ để giới hạn chức năng và số nhà hàng của các thương hiệu.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Tên gói cước <span className="text-red-500">*</span></label>
                            <input type="text" {...register("name")} className={`w-full px-4 py-2.5 border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`} placeholder="VD: Gói Chuyên Nghiệp" />
                            {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Trạng thái mở bán</label>
                            <div className="flex items-center mt-3 cursor-pointer" onClick={() => setValue('isActive', !isActive)}>
                                <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isActive ? 'translate-x-6' : ''}`}></div>
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-700">{isActive ? 'Đang bán' : 'Dừng bán'}</span>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Mô tả</label>
                            <textarea {...register("description")} rows={2} className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px] resize-none" placeholder="Mô tả ngắn gọn về gói cước..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Giá tiền (VNĐ) <span className="text-red-500">*</span></label>
                                <input type="number" {...register("price")} className={`w-full px-4 py-2.5 border ${errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`} placeholder="VD: 500000" />
                                {errors.price && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.price.message}</p>}
                            </div>

                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Giá khuyến mãi (VNĐ)</label>
                                <input type="number" {...register("discountPrice")} className={`w-full px-4 py-2.5 border ${errors.discountPrice ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`} placeholder="Để trống nếu ko KM" />
                                {errors.discountPrice && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.discountPrice.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Từ ngày</label>
                                <input type="date" {...register("discountStartDate")} className={`w-full px-4 py-2.5 border ${errors.discountStartDate ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`} />
                                {errors.discountStartDate && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.discountStartDate.message}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Đến ngày</label>
                                <input type="date" {...register("discountEndDate")} className={`w-full px-4 py-2.5 border ${errors.discountEndDate ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`} />
                                {errors.discountEndDate && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.discountEndDate.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Chu kỳ thanh toán <span className="text-red-500">*</span></label>
                            <select {...register("billingCycle")} className={`w-full px-4 py-2.5 border ${errors.billingCycle ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`}>
                                <option value="MONTHLY">Hàng tháng</option>
                                <option value="YEARLY">Hàng năm</option>
                                <option value="LIFETIME">Trọn đời (Thanh toán 1 lần)</option>
                            </select>
                            {errors.billingCycle && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.billingCycle.message}</p>}
                        </div>

                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Giới hạn số nhà hàng <span className="text-red-500">*</span></label>
                            <input type="number" {...register("maxRestaurants")} className={`w-full px-4 py-2.5 border ${errors.maxRestaurants ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`} placeholder="Nhập -1 nếu không giới hạn" />
                            {errors.maxRestaurants && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.maxRestaurants.message}</p>}
                            <p className="text-xs text-gray-400 mt-1">Mẹo: -1 là không giới hạn số lượng</p>
                        </div>

                        <div className="md:col-span-2 border-t border-gray-100 pt-6">
                            <label className="block text-[13px] font-semibold text-gray-700 mb-2">Các tính năng (Features) <span className="text-red-500">*</span></label>
                            <p className="text-[12px] text-gray-500 mb-4">Lựa chọn các tính năng được phép sử dụng trong gói cước này.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Object.entries(featureNames).map(([key, label]) => {
                                    const isSelected = features.includes(key);
                                    return (
                                        <div 
                                            key={key} 
                                            onClick={() => toggleFeature(key)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200 hover:border-indigo-100 hover:bg-gray-50'}`}
                                        >
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                                                {isSelected && <FiCheck className="text-white text-xs" />}
                                            </div>
                                            <span className={`text-[13px] font-medium ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>{label as string}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.features && <p className="text-red-500 text-xs mt-3 font-medium">{errors.features.message}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button disabled={isPending} type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[14px] font-medium rounded-xl transition-colors">
                            Hủy bỏ
                        </button>
                        <button disabled={isPending} type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-medium rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                            {isPending ? 'Đang lưu...' : <><FiCheck className="text-lg" /> Thêm gói cước</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
