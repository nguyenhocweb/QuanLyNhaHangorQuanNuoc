'use client';

import React, { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { DineInOrderMain } from '@/src/features/customer/dine_in_order/component/DineInOrderMain';

function DineInOrderContent() {
    const params = useParams();
    const searchParams = useSearchParams();

    const idRestaurant = params.idRestaurant as string;
    const reservationId = searchParams.get('reservationId') || undefined;

    return (
        <DineInOrderMain
            restaurantId={idRestaurant}
            reservationId={reservationId}
        />
    );
}

export default function DineInOrderPage() {
    return (
        <Suspense fallback={
            <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-gray-500 text-sm">Đang tải trang gọi món...</p>
            </div>
        }>
            <DineInOrderContent />
        </Suspense>
    );
}
