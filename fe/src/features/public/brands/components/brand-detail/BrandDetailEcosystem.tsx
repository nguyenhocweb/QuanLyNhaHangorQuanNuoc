"use client";

import React from "react";
import { FaUtensils, FaBuilding, FaCrown, FaStar } from "react-icons/fa";
import FeaturedDishComponent from "@/src/features/public/dish/dish_component/featured-dish-component";
import Featured_Restaurant_Component from "@/src/features/public/restaurant/restaurant_components/demo-card-restaurant/featured-restaurant-component";
import { usePerformanceMode } from "@/src/core/hooks/usePerformanceMode";

interface BrandDetailEcosystemProps {
    idBrand: string;
    brandName?: string;
    grid?: number;
}

export default function BrandDetailEcosystem({ idBrand, brandName = "Thương hiệu", grid }: BrandDetailEcosystemProps) {
    const { is3D } = usePerformanceMode();

    return (
        <div className="flex flex-col gap-16 sm:gap-24 w-full animate-fade-in mt-8 mb-16">
            
            {/* --- PHÂN KHU 1: THỰC ĐƠN TINH HOA THƯƠNG HIỆU --- */}
            <div className="flex flex-col gap-8">
                {/* Header Phân khu 1 */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-gray-500/20">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest">
                            <FaStar />
                            Hương vị Độc quyền
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-xl shadow-inner">
                                <FaUtensils />
                            </span>
                            Thực Đơn Tinh Hoa {brandName}
                        </h2>
                    </div>
                    <p className={`text-sm max-w-md sm:text-right ${is3D ? "text-gray-300" : "text-gray-600"}`}>
                        Tuyệt phẩm ẩm thực làm nên tên tuổi và phong cách riêng biệt, được chọn lọc khắt khe từ các tổng bếp trưởng hàng đầu.
                    </p>
                </div>

                {/* Nội dung Món ăn Tinh hoa */}
                <div className="w-full">
                    <FeaturedDishComponent type="isBrand" id={idBrand} limit={6} grid={grid} />
                </div>
            </div>

            {/* --- PHÂN KHU 2: HỆ THỐNG CHI NHÁNH NHÀ HÀNG --- */}
            <div className="flex flex-col gap-8">
                {/* Header Phân khu 2 */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-gray-500/20">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-widest">
                            <FaCrown />
                            Mạng lưới Trải nghiệm VIP
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-xl shadow-inner">
                                <FaBuilding />
                            </span>
                            Hệ Thống Chi Nhánh Trực Thuộc
                        </h2>
                    </div>
                    <p className={`text-sm max-w-md sm:text-right ${is3D ? "text-gray-300" : "text-gray-600"}`}>
                        Không gian sang trọng, dịch vụ chuyên nghiệp 5 sao. Đặt bàn trực tiếp để giữ chỗ cho những bữa tiệc quan trọng nhất của quý khách.
                    </p>
                </div>

                {/* Nội dung Chi nhánh Nhà hàng */}
                <div className="w-full">
                    <Featured_Restaurant_Component type="page" id={idBrand} limit={6} grid={grid} />
                </div>
            </div>

        </div>
    );
}
