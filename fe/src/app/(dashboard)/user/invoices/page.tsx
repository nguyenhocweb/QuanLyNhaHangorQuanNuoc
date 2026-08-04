"use client";

import React from 'react';
import FadeIn from "@/src/core/components/animation/FadeIn";
import { InvoiceHistoryTable } from '@/src/features/customer/invoices/component/InvoiceHistoryTable';

export default function MyInvoicesPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Hóa đơn điện tử</h1>
                <p className="text-gray-500 text-sm">Tra cứu thông tin hóa đơn và biên lai thanh toán cho các bữa ăn của bạn.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <InvoiceHistoryTable />
            </div>
        </FadeIn>
    );
}
