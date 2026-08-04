import React, { useState } from 'react';
import { BiPurchaseTagAlt } from 'react-icons/bi';
import { SubscriptionPaymentFlow } from './SubscriptionPaymentFlow';

interface MyBrandSubscriptionProps {
    subscription: any;
    isSubscriptionLoading: boolean;
}

const MyBrandSubscription = ({ subscription, isSubscriptionLoading }: MyBrandSubscriptionProps) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BiPurchaseTagAlt className="text-blue-500" />
                Gói cước thương hiệu hiện tại
            </h3>
            {isSubscriptionLoading ? (
                <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : subscription && subscription.plan ? (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h4 className="text-lg font-bold text-blue-800 mb-2">{subscription.plan.name}</h4>
                            <p className="text-blue-600 font-medium">
                                Số lượng nhà hàng tối đa: {subscription.plan.maxRestaurants === -1 ? 'Không giới hạn' : subscription.plan.maxRestaurants}
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                            Nâng cấp gói cước
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-slate-500 mb-6">Thương hiệu chưa đăng ký gói cước nào.</p>
                    <button 
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg inline-block"
                    >
                        Đăng ký ngay
                    </button>
                </div>
            )}
            
            <SubscriptionPaymentFlow 
                isOpen={isPaymentModalOpen} 
                onClose={() => setIsPaymentModalOpen(false)} 
            />
        </div>
    );
};

export default MyBrandSubscription;
