import React from 'react';
import PromotionsList from '@/src/features/brand_owner/promotions/component/PromotionsList';

export const metadata = {
    title: 'Quản lý Khuyến mãi | Tên Thương Hiệu', // You can dynamically set this if needed
};

export default function PromotionsPage() {
    return (
        <PromotionsList />
    );
}
