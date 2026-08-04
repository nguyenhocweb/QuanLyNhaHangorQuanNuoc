import React, { Suspense } from "react";
import PublicHome from "@/src/core/components/layout/public-home";

const PageHome = () => {
    return (
        <Suspense fallback={
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-600/20 border-t-indigo-600 animate-spin" />
                    <span className="text-sm font-semibold text-gray-500">Đang tải trải nghiệm Foleat 3D...</span>
                </div>
            </div>
        }>
            <PublicHome />
        </Suspense>
    );
};

export default PageHome;