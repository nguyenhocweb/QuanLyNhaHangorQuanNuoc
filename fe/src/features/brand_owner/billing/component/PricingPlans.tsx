"use client";
import React, { useState } from 'react';
import { FiCheck, FiStar } from 'react-icons/fi';
import { useGetSubscriptionPlans, useCheckoutSubscription } from '../hook/useBilling_hook';
import { SubscriptionPlan } from '@/src/features/system_admin/subscriptions/type/subscription.type';
import { SUBSCRIPTION_FEATURES, FEATURE_NAMES, FEATURE_DESCRIPTIONS } from '../constants/subscription.constant';
import { FiInfo } from 'react-icons/fi';

interface PricingPlansProps {
    brandId: string;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ brandId }) => {
    const { data: responseData, isLoading } = useGetSubscriptionPlans(brandId);
    const plans: SubscriptionPlan[] = (responseData as any)?.data?.metadata || [];
    
    const { mutate: checkout, isPending: isCheckingOut } = useCheckoutSubscription(brandId);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getBillingCycleText = (cycle: string) => {
        switch(cycle) {
            case 'MONTHLY': return '/tháng';
            case 'YEARLY': return '/năm';
            case 'LIFETIME': return ' trọn đời';
            default: return cycle;
        }
    };

    const handleCheckout = (planId: string) => {
        setSelectedPlanId(planId);
        checkout(planId, {
            onSettled: () => {
                setSelectedPlanId(null);
            }
        });
    };

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500">Đang tải các gói cước...</div>;
    }

    return (
        <div className="py-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nâng cấp Gói Cước</h2>
                <p className="text-gray-500">Chọn gói cước phù hợp với quy mô kinh doanh của bạn. Nâng cấp để mở khóa nhiều tính năng quản lý nâng cao.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, index) => {
                    const isPopular = index === 1 || plan.price === 500000; // Fake a popular badge
                    const isCheckingOutThis = isCheckingOut && selectedPlanId === plan.id;
                    const featuresList = Object.keys(plan.featuresData || {});
                    const totalAvailableFeatures = Object.keys(SUBSCRIPTION_FEATURES).length;
                    const hasAllFeatures = featuresList.length >= totalAvailableFeatures;

                    return (
                        <div 
                            key={plan.id} 
                            className={`group [perspective:2000px] h-full ${isPopular ? 'scale-105 z-10' : ''}`}
                        >
                            <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                                {/* MẶT TRƯỚC */}
                                <div 
                                    className={`[backface-visibility:hidden] relative flex flex-col h-full bg-white rounded-3xl p-8 ${isPopular ? 'shadow-xl shadow-indigo-100 border-2 border-indigo-600' : 'shadow-sm border border-gray-100'}`}
                                >
                                    {isPopular && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                                            <FiStar /> Phổ biến nhất
                                        </div>
                                    )}

                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                        <p className="text-gray-500 text-sm mt-2 h-10">{plan.description}</p>
                                    </div>

                                    <div className="mb-8">
                                        {plan.discountPrice && plan.discountPrice > 0 ? (
                                            <div className="flex flex-col">
                                                <div className="flex items-end gap-2">
                                                    <span className="text-4xl font-black text-gray-900">{formatPrice(plan.discountPrice)}</span>
                                                    <span className="text-gray-500 font-medium mb-1.5">{getBillingCycleText(plan.billingCycle)}</span>
                                                </div>
                                                <span className="text-sm text-gray-400 line-through mt-1">{formatPrice(plan.price)}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-end gap-2">
                                                <span className="text-4xl font-black text-gray-900">{formatPrice(plan.price)}</span>
                                                <span className="text-gray-500 font-medium mb-1.5">{getBillingCycleText(plan.billingCycle)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <ul className="space-y-4 mb-8 flex-1">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 bg-green-50 text-green-500 p-1 rounded-full"><FiCheck className="text-xs" /></div>
                                            <span className="text-sm text-gray-700 font-medium">
                                                {plan.maxRestaurants === -1 ? 'Không giới hạn số nhà hàng' : `Tối đa ${plan.maxRestaurants} nhà hàng`}
                                            </span>
                                        </li>
                                        {plan.trialPeriodDays > 0 && (
                                            <li className="flex items-start gap-3">
                                                <div className="mt-0.5 bg-green-50 text-green-500 p-1 rounded-full"><FiCheck className="text-xs" /></div>
                                                <span className="text-sm text-gray-700 font-medium">Dùng thử {plan.trialPeriodDays} ngày miễn phí</span>
                                            </li>
                                        )}
                                        <li className="flex items-start gap-3">
                                            <div className="mt-0.5 bg-indigo-50 text-indigo-500 p-1 rounded-full"><FiCheck className="text-xs" /></div>
                                            <span className="text-sm text-gray-700 font-medium">
                                                {hasAllFeatures ? 'Tất cả tính năng nâng cao' : `${featuresList.length} tính năng nâng cao`}
                                            </span>
                                        </li>
                                    </ul>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-center text-gray-400 text-xs gap-1.5 mb-4 group-hover:opacity-0 transition-opacity">
                                        <FiInfo /> Rẽ chuột để xem chi tiết tính năng
                                    </div>

                                    <button 
                                        onClick={() => handleCheckout(plan.id)}
                                        disabled={isCheckingOutThis}
                                        className={`w-full py-3.5 rounded-xl text-[15px] font-bold transition-all flex items-center justify-center gap-2 ${isPopular ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'} disabled:opacity-70 disabled:cursor-not-allowed`}
                                    >
                                        {isCheckingOutThis ? 'Đang xử lý...' : 'Chọn gói này'}
                                    </button>
                                </div>

                                {/* MẶT SAU (FLIP) */}
                                <div 
                                    className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col bg-white rounded-3xl p-6 shadow-xl ${isPopular ? 'border-2 border-indigo-600' : 'border border-gray-200'} overflow-hidden`}
                                >
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2">Chi tiết tính năng</h3>
                                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        {featuresList.length === 0 ? (
                                            <div className="text-sm text-gray-500 italic mt-4 text-center">Gói này chỉ bao gồm các tính năng cơ bản.</div>
                                        ) : hasAllFeatures ? (
                                            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                                                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg mb-2">
                                                    <FiStar className="w-8 h-8" />
                                                </div>
                                                <h4 className="font-bold text-indigo-600 text-lg">KHÔNG GIỚI HẠN</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    Bạn được mở khóa <strong>toàn bộ {totalAvailableFeatures} tính năng cao cấp nhất</strong> của hệ thống (Menu, Sơ đồ bàn, POS, AI Chatbot, KDS, Kho...).
                                                </p>
                                            </div>
                                        ) : (
                                            featuresList.map((key) => (
                                                <div key={key} className="flex flex-col bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                                    <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                                        <FiCheck className="text-green-500 shrink-0" />
                                                        {FEATURE_NAMES[key] || key}
                                                    </span>
                                                    {FEATURE_DESCRIPTIONS[key] && (
                                                        <span className="text-xs text-gray-500 mt-1 ml-6 leading-relaxed">
                                                            {FEATURE_DESCRIPTIONS[key]}
                                                        </span>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => handleCheckout(plan.id)}
                                        disabled={isCheckingOutThis}
                                        className={`w-full py-3 mt-4 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${isPopular ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'} disabled:opacity-70 disabled:cursor-not-allowed`}
                                    >
                                        {isCheckingOutThis ? 'Đang xử lý...' : 'Chọn gói này'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
