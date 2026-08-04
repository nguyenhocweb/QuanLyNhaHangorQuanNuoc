"use client";

import React from "react";
import FeaturedBrandComponent from "@/src/features/public/brands/components/featured-brands-components";
import Featured_Restaurant_Component from "@/src/features/public/restaurant/restaurant_components/demo-card-restaurant/featured-restaurant-component";
import FeaturedDishComponent from "@/src/features/public/dish/dish_component/featured-dish-component";
import FadeIn from "../../animation/FadeIn";

export const HomeFeaturedShowcase: React.FC = () => {
    return (
        <div className="w-full relative py-16 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto flex flex-col gap-28 sm:gap-36 overflow-hidden">
            {/* Hào quang nền 3D */}
            <div className="absolute -left-40 top-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -right-40 top-2/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Phân khu 1: Thương hiệu Tiêu biểu */}
            <div id="featured-brands" className="w-full flex flex-col gap-8 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                    <div className="flex flex-col gap-2">
                        <FadeIn>
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3.5 py-1.5 rounded-full w-fit">
                                👑 Đối tác Chiến lược
                            </span>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                                Thương hiệu <span className="text-indigo-600">Tiêu biểu</span>
                            </h2>
                        </FadeIn>
                    </div>
                    <FadeIn delay={0.2}>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Các chuỗi nhà hàng danh tiếng đồng hành cùng NVNguyen đem đến chất lượng dịch vụ chuẩn mực quốc tế.
                        </p>
                    </FadeIn>
                </div>

                <FadeIn delay={0.3}>
                    <div className="w-full">
                        <FeaturedBrandComponent type="home" />
                    </div>
                </FadeIn>
            </div>

            {/* Phân khu 2: Nhà hàng Nổi bật */}
            <div id="featured-restaurants" className="w-full flex flex-col gap-8 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                    <div className="flex flex-col gap-2">
                        <FadeIn>
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full w-fit">
                                🌟 Lựa chọn Hàng đầu
                            </span>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                                Nhà hàng <span className="text-emerald-600">Được Yêu Thích Nhất</span>
                            </h2>
                        </FadeIn>
                    </div>
                    <FadeIn delay={0.2}>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Đặt bàn nhanh chóng tại các điểm đến ẩm thực sở hữu không gian sang trọng và thực đơn thượng hạng.
                        </p>
                    </FadeIn>
                </div>

                <FadeIn delay={0.3}>
                    <div className="w-full">
                        <Featured_Restaurant_Component type="home" />
                    </div>
                </FadeIn>
            </div>

            {/* Phân khu 3: Món ăn Đặc sắc */}
            <div id="featured-dishes" className="w-full flex flex-col gap-8 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                    <div className="flex flex-col gap-2">
                        <FadeIn>
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3.5 py-1.5 rounded-full w-fit">
                                🧑‍🍳 Nghệ thuật Ẩm thực
                            </span>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                                Món ăn <span className="text-amber-500">Đặc Sắc Hôm Nay</span>
                            </h2>
                        </FadeIn>
                    </div>
                    <FadeIn delay={0.2}>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Khám phá những món ăn trứ danh được chế biến từ nguyên liệu tươi ngon nhất dưới bàn tay của các bếp trưởng tài hoa.
                        </p>
                    </FadeIn>
                </div>

                <FadeIn delay={0.3}>
                    <div className="w-full">
                        <FeaturedDishComponent type="home" />
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};
