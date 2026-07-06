"use client";
import React from 'react';
import { PaymentMethodList } from '@/src/features/system_admin/payment_methods/component/PaymentMethodList';

export default function PaymentMethodsPage() {
    return (
        <div className="w-full h-[calc(100vh-64px)] overflow-y-auto bg-gray-50/30">
            <PaymentMethodList />
        </div>
    );
}
