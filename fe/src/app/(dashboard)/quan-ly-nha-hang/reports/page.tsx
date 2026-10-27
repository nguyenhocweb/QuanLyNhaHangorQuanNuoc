import React from 'react';
import { RestaurantRevenueDashboard } from '@/src/features/quan_ly_nha_hang/report/components/RestaurantRevenueDashboard';

const ReportsPage = () => {
    return (
        <div className="w-full flex flex-col gap-6">
            <RestaurantRevenueDashboard />
        </div>
    );
};

export default ReportsPage;
