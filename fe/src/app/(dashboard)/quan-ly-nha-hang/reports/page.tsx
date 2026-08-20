import React from 'react';
import { RestaurantRevenueDashboard } from '@/src/features/restaurant_manager/report/components/RestaurantRevenueDashboard';

const ReportsPage = () => {
    return (
        <div className="w-full flex flex-col gap-6">
            <RestaurantRevenueDashboard />
        </div>
    );
};

export default ReportsPage;
