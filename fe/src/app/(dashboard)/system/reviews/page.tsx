"use client";

import React from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { ReviewStatsCards } from "@/src/features/system_admin/reviews/component/ReviewStatsCards";
import { SystemReviewsTable } from "@/src/features/system_admin/reviews/component/SystemReviewsTable";
import { MdOutlineRateReview } from "react-icons/md";

const SystemReviewsPage = () => {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header Area */}
            <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                        <MdOutlineRateReview className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                            Quản lý Đánh giá Toàn sàn
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-0.5">
                            Giám sát chỉ số hài lòng khách hàng (CSAT) và kiểm duyệt nội dung phản hồi trên toàn hệ sinh thái
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI Stats Overview Cards */}
            <ReviewStatsCards />

            {/* Main Reviews Management Table */}
            <SystemReviewsTable />
        </FadeIn>
    );
};

export default SystemReviewsPage;
