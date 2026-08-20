"use client";
import React, { useState } from 'react';
import { InvoiceList } from './InvoiceList';
import { PricingPlans } from './PricingPlans';
import { H, P } from '@/src/core/components/ui';

interface BillingDashboardProps {
    brandId: string;
}

export const BillingDashboard: React.FC<BillingDashboardProps> = ({ brandId }) => {
    const [activeTab, setActiveTab] = useState<'invoices' | 'pricing'>('pricing');

    return (
        <div className="w-full h-full flex flex-col gap-6 p-6 overflow-y-auto">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                <div>
                    <H variant="text_black" className="text-2xl font-bold text-gray-900">Thanh toán & Gói cước</H>
                    <P className="text-gray-500 mt-1">Quản lý hóa đơn và nâng cấp các gói dịch vụ của bạn</P>
                </div>
                
                <div className="flex bg-gray-100 p-1.5 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('pricing')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'pricing' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Gói cước
                    </button>
                    <button 
                        onClick={() => setActiveTab('invoices')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'invoices' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Lịch sử Hóa đơn
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
                {activeTab === 'pricing' ? (
                    <PricingPlans brandId={brandId} />
                ) : (
                    <InvoiceList brandId={brandId} />
                )}
            </div>
        </div>
    );
};
