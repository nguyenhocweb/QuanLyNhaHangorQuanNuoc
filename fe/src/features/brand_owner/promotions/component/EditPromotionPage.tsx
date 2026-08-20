"use client";

import React, { useState, useEffect } from 'react';
import { Div, H, Button } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiCheck, FiChevronRight } from 'react-icons/fi';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePromotionSchema, UpdatePromotionFormValues } from '../schema/promotion.schema';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useUpdatePromotion } from '../hook/useUpdatePromotion';
import { useGetPromotionById } from '../hook/useGetPromotionById';
import { toast } from 'sonner';

import { Step1Basic } from './steps/Step1Basic';
import { Step2Time } from './steps/Step2Time';
import { Step3Target } from './steps/Step3Target';
import { Step4Budget } from './steps/Step4Budget';

const STEPS = [
    { id: 1, title: 'Cơ bản', description: 'Thông tin chung' },
    { id: 2, title: 'Thời gian', description: 'Lịch áp dụng' },
    { id: 3, title: 'Phạm vi', description: 'Đối tượng & Chi nhánh' },
    { id: 4, title: 'Ngân sách', description: 'Giới hạn & Lưu' },
];

const EditPromotionPage = ({ promotionId }: { promotionId: string }) => {
    const router = useRouter();
    const { user } = useAuthStore();
    const brandId = user?.brand?.[0]?.id || "";
    const [currentStep, setCurrentStep] = useState(1);

    const { data: promotionData, isLoading } = useGetPromotionById(brandId, promotionId);
    const { mutate: updatePromotion, isPending } = useUpdatePromotion();

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
    };

    const methods = useForm<UpdatePromotionFormValues>({
        resolver: zodResolver(updatePromotionSchema) as any,
        defaultValues: {
            code: promotionData?.code || "",
            description: promotionData?.description || "",
            discountType: promotionData?.discountType || "PERCENTAGE",
            discountValue: promotionData?.discountValue || 0,
            minOrderValue: promotionData?.minOrderValue ?? undefined,
            maxDiscount: promotionData?.maxDiscount ?? undefined,
            validFrom: formatDate(promotionData?.validFrom),
            validUntil: formatDate(promotionData?.validUntil),
            daysOfWeek: promotionData?.daysOfWeek || ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
            timeStart: promotionData?.timeStart || "",
            timeEnd: promotionData?.timeEnd || "",
            targetAudience: promotionData?.targetAudience || 'ALL',
            usageLimit: promotionData?.usageLimit ?? undefined,
            usageLimitPerUser: promotionData?.usageLimitPerUser ?? undefined,
            maxBudget: promotionData?.maxBudget ?? undefined,
            image: promotionData?.image || "",
            restaurantIds: promotionData?.restaurantIds || [],
            menuItemIds: promotionData?.menuItemIds || [],
            isActive: promotionData?.isActive ?? true,
        },
        mode: 'onChange'
    });

    // Cập nhật lại form nếu promotionData bị tải chậm (phòng hờ)
    useEffect(() => {
        if (promotionData) {
            methods.reset({
                code: promotionData.code,
                description: promotionData.description || "",
                discountType: promotionData.discountType,
                discountValue: promotionData.discountValue,
                minOrderValue: promotionData.minOrderValue ?? undefined,
                maxDiscount: promotionData.maxDiscount ?? undefined,
                validFrom: formatDate(promotionData.validFrom),
                validUntil: formatDate(promotionData.validUntil),
                daysOfWeek: promotionData.daysOfWeek || [],
                timeStart: promotionData.timeStart || "",
                timeEnd: promotionData.timeEnd || "",
                targetAudience: promotionData.targetAudience || 'ALL',
                usageLimit: promotionData.usageLimit ?? undefined,
                usageLimitPerUser: promotionData.usageLimitPerUser ?? undefined,
                maxBudget: promotionData.maxBudget ?? undefined,
                image: promotionData.image || "",
                restaurantIds: promotionData.restaurantIds || [],
                menuItemIds: promotionData.menuItemIds || [],
                isActive: promotionData.isActive,
            });
        }
    }, [promotionData, methods]);

    const onSubmit = (data: UpdatePromotionFormValues) => {
        updatePromotion(
            { brandId, promotionId, payload: data },
            {
                onSuccess: () => {
                    toast.success('Cập nhật chiến dịch khuyến mãi thành công!');
                    router.push('/brand_owner/promotions');
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật chiến dịch');
                }
            }
        );
    };

    const onError = (errors: any) => {
        console.log("Form Errors:", errors);
        toast.error('Vui lòng kiểm tra lại thông tin các bước (có trường bị thiếu hoặc sai định dạng).');
    };

    const nextStep = async () => {
        let isValid = false;
        
        if (currentStep === 1) {
            isValid = await methods.trigger(['code', 'discountType', 'discountValue', 'minOrderValue', 'maxDiscount', 'description']);
        } else if (currentStep === 2) {
            isValid = await methods.trigger(['validFrom', 'validUntil', 'daysOfWeek', 'timeStart', 'timeEnd']);
        } else if (currentStep === 3) {
            isValid = await methods.trigger(['targetAudience', 'restaurantIds', 'menuItemIds']);
        } else {
            isValid = true;
        }

        if (isValid && currentStep < 4) {
            setCurrentStep(s => s + 1);
        } else if (!isValid) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc hoặc kiểm tra lại định dạng");
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(s => s - 1);
    };

    const [canSubmit, setCanSubmit] = useState(false);

    useEffect(() => {
        if (currentStep === 4) {
            const timer = setTimeout(() => setCanSubmit(true), 500);
            return () => clearTimeout(timer);
        } else {
            setCanSubmit(false);
        }
    }, [currentStep]);

    if (isLoading || !promotionData) {
        return <div className="w-full py-20 flex justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <FadeIn className="w-full max-w-5xl mx-auto flex flex-col gap-8 pb-10">
            {/* Header */}
            <Div vitri="row_between" className="w-full">
                <Div className="gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-gray-200 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <FiArrowLeft className="text-slate-600" />
                    </button>
                    <Div vitri="col_none" className="gap-1">
                        <H level={2} className="text-2xl font-bold text-slate-800">Chỉnh Sửa Khuyến Mãi</H>
                        <p className="text-sm text-slate-500">Cập nhật chi tiết mã giảm giá, giới hạn ngân sách và phạm vi áp dụng.</p>
                    </Div>
                </Div>
            </Div>

            {/* Stepper Header */}
            <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative">
                <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 z-0 hidden md:block"></div>
                <div className="absolute top-1/2 left-8 h-1 bg-indigo-500 -translate-y-1/2 z-0 hidden md:block transition-all duration-500" style={{ width: `calc(${(currentStep - 1) / 3 * 100}% - 4rem)` }}></div>
                
                {STEPS.map((step) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;
                    
                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-white px-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 transition-colors duration-300 ${
                                isCompleted ? 'bg-indigo-500 border-indigo-500 text-white' : 
                                isActive ? 'bg-white border-indigo-500 text-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 
                                'bg-white border-slate-200 text-slate-400'
                            }`}>
                                {isCompleted ? <FiCheck className="text-xl" /> : step.id}
                            </div>
                            <div className="hidden md:flex flex-col items-center">
                                <span className={`text-sm font-bold ${isActive || isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>{step.title}</span>
                                <span className="text-xs text-slate-400">{step.description}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Form Content */}
            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit, onError)} className="w-full flex flex-col">
                        
                        <div className="p-8">
                            {currentStep === 1 && <Step1Basic />}
                            {currentStep === 2 && <Step2Time />}
                            {currentStep === 3 && <Step3Target />}
                            {currentStep === 4 && <Step4Budget />}
                        </div>

                        {/* Footer Controls */}
                        <div className="p-6 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
                            <Button 
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`px-6 py-2.5 rounded-xl font-semibold transition-colors ${currentStep === 1 ? 'opacity-0 cursor-default' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 shadow-sm'}`}
                            >
                                Quay lại
                            </Button>

                            {currentStep < 4 ? (
                                <Button 
                                    type="button"
                                    onClick={nextStep}
                                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 font-semibold"
                                >
                                    Tiếp tục <FiChevronRight />
                                </Button>
                            ) : (
                                <Button 
                                    type="submit"
                                    disabled={isPending || !canSubmit}
                                    className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-all font-semibold flex items-center gap-2"
                                >
                                    {isPending ? 'Đang lưu...' : <><FiCheck /> Lưu thay đổi</>}
                                </Button>
                            )}
                        </div>

                    </form>
                </FormProvider>
            </div>
        </FadeIn>
    );
};

export default EditPromotionPage;
