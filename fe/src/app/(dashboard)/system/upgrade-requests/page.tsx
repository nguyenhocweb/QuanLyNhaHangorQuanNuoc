import React from 'react';
import { UpgradeRequestList } from '@/src/features/system_admin/upgrade_requests/components/UpgradeRequestList';
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function UpgradeRequestsPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Yêu cầu nâng cấp đối tác</h1>
                <p className="text-gray-500 text-sm">Quản lý và duyệt các yêu cầu đăng ký trở thành đối tác thương hiệu.</p>
            </div>
            <UpgradeRequestList />
        </FadeIn>
    );
}
