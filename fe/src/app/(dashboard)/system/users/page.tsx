import React from 'react';
import UsersSystemComponent from '@/src/features/system_admin/users/component/usersSytem-component';
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function UsersPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Tài khoản toàn cục</h1>
                <p className="text-gray-500 text-sm">Quản lý toàn bộ tài khoản người dùng trên hệ thống Foleat.</p>
            </div>
            <UsersSystemComponent />
        </FadeIn>
    );
}
