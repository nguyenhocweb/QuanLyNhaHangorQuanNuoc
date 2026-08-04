"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetPublicRestaurantCore } from "@/src/features/public/restaurant/hook/useGetPublicRestaurantCore";
import { useGetPublicRestaurantHours } from "@/src/features/public/restaurant/hook/useGetPublicRestaurantHours";
import TemplateRenderer from "@/src/features/public/restaurant/templates/TemplateRenderer";

export default function PublicRestaurantPage() {
    const params = useParams();
    const idRestaurant = params.idRestaurant as string;

    // Fetch Core Data
    const { data: coreInfo, isLoading: isLoadingCore, error: errorCore } = useGetPublicRestaurantCore(idRestaurant);
    const { data: hoursData } = useGetPublicRestaurantHours(idRestaurant);

    if (isLoadingCore) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Đang tải thông tin nhà hàng...</p>
            </div>
        );
    }

    if (errorCore || !coreInfo) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600 text-lg mb-8">Rất tiếc, nhà hàng này không tồn tại hoặc đã tạm ngưng hoạt động.</p>
            </div>
        );
    }

    // Pass dữ liệu xuống cho Template Renderer xử lý việc load giao diện tương ứng
    return (
        <TemplateRenderer 
            idRestaurant={idRestaurant}
            coreInfo={coreInfo}
            hoursData={hoursData}
        />
    );
}