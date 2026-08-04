"use client";

import React from "react";
import ReviewsTable from "@/src/features/brand_owner/reviews/component/ReviewsTable";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { Div, H, P } from "@/src/core/components/ui";

const BrandOwnerReviewsPage = () => {
    const { user } = useAuthStore();

    const brandId = user?.brand?.[0]?.id;

    if (!brandId) {
        return (
            <Div>
                <div className="flex flex-col items-center justify-center p-10 h-[50vh]">
                    <P>Vui lòng đăng nhập bằng tài khoản Chủ thương hiệu để xem trang này.</P>
                </div>
            </Div>
        );
    }

    return (
        <Div vitri="col_none" className="p-6 bg-slate-50 min-h-screen gap-6 w-full">
            <div className="flex flex-col gap-2">
                <H level={2} className="text-2xl font-bold text-slate-800">
                    Đánh giá từ khách hàng
                </H>
                <P className="text-gray-500">
                    Xem và phản hồi đánh giá của khách hàng về tất cả chi nhánh thuộc hệ thống.
                </P>
            </div>

            <ReviewsTable brandId={brandId} />
        </Div>
    );
};

export default BrandOwnerReviewsPage;
