import React from 'react';
import SelectWorkspaceClient from '@/src/features/auth/auth_components/SelectWorkspaceClient';

export const metadata = {
    title: "Chọn không gian làm việc | Hệ thống quản lý",
    description: "Chọn không gian làm việc của bạn",
};

export default function SelectWorkspacePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden">
            {/* Background elements for premium feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="w-full max-w-4xl px-4 z-10 py-12">
                <SelectWorkspaceClient />
            </div>
        </div>
    );
}
