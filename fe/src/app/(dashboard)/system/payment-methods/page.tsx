import React from 'react';
import { PaymentMethodList } from '@/src/features/system_admin/payment_methods/component/PaymentMethodList';
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function PaymentMethodsPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Phương thức thanh toán</h1>
                <p className="text-gray-500 text-sm">Quản lý các cổng thanh toán hỗ trợ (VNPay, Momo, v.v.).</p>
            </div>
            <PaymentMethodList />
        </FadeIn>
    );
}
