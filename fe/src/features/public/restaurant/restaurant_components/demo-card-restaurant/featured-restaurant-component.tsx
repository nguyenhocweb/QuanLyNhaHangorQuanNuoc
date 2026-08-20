"use client";

import React from "react";
import Link from "next/link";
import { Div, P } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useRestaurandCard } from "@/src/features/public/restaurant/restaurant_hook/useRestaurantCard_hook";
import Card_Restaurant_Component from "./card-restaurant-component";
import Loading from "@/src/core/components/layout/public-loading";
import { usePagination } from "@/src/core/hooks/usePagination";
import Pagination from "@/src/core/components/layout/Pagination";
import { usePerformanceMode } from "@/src/core/hooks/usePerformanceMode";

const Featured_Restaurant_Component = ({
    type,
    id,
    limit: propLimit,
    grid,
    hideHeader
}: {
    type: "home" | "page";
    id?: string;
    limit?: number;
    grid?: number;
    hideHeader?: boolean;
}) => {
    const { pageRestaurant, city, searchKeyword, setPageRestaurant, categoryRestaurant, review, limit: queryLimit, setLimit } = usePagination();
    const currentLimit = propLimit ?? (type === "page" ? queryLimit : 3);
    
    const { data, isLoading } = useRestaurandCard({
        page: pageRestaurant || 1,
        limit: currentLimit,
        city: city ?? undefined,
        search: searchKeyword ?? undefined,
        id: id,
        categoryRestaurant: categoryRestaurant ?? [],
        review: review ?? undefined
    });
    const { is3D } = usePerformanceMode();

    if (isLoading) return <Loading />;

    const restaurantList = data?.data ?? [];

    return (
        <div id="restaurant" className="w-full relative flex flex-col gap-6">
            {/* Hào quang 3D phía sau khi chế độ 3D được bật */}
            {is3D && type === "home" && (
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-amber-500/10 rounded-3xl blur-3xl pointer-events-none" />
            )}

            {/* Chỉ hiển thị tiêu đề nếu KHÔNG phải ở trang home (vì trang home đã có header chuyên biệt tại HomeFeaturedShowcase) và không bị hideHeader */}
            {type !== "home" && !hideHeader && (
                <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100/80 pb-6 mb-2">
                    <div className="flex flex-col gap-2">
                        <FadeIn>
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-200/50 shadow-sm">
                                🍽️ Hệ thống Ẩm thực NVNguyen
                            </span>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                                Danh Sách <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Nhà Hàng Tuyển Chọn</span>
                            </h1>
                        </FadeIn>
                    </div>
                    <FadeIn delay={0.2}>
                        <p className="text-sm text-gray-600 max-w-sm font-medium leading-relaxed">
                            Trải nghiệm không gian ẩm thực sang trọng, thực đơn phong phú cùng dịch vụ đẳng cấp 5 sao.
                        </p>
                    </FadeIn>
                </div>
            )}

            {/* Bố cục Lưới 3 Cột Responsive Chuẩn Senior Pro Max */}
            <div className={`w-full grid grid-cols-1 sm:grid-cols-2 ${grid === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"} gap-6 sm:gap-8 items-stretch relative z-10`}>
                {restaurantList.map((e, index) => (
                    <Card_Restaurant_Component key={e.id} dataRestaurant={e} index={index} />
                ))}
            </div>

            {/* Nút Khám phá Glowing Pill chuẩn Senior Pro Max trên Trang chủ */}
            {type === "home" && !!data?.total && (
                <div className="w-full flex justify-center mt-6 relative z-10">
                    <FadeIn delay={0.4}>
                        <Link
                            href="/restaurants"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gray-900 via-slate-800 to-black hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm tracking-wide shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-300 group"
                        >
                            <span>✨ Xem toàn bộ {(data?.total ?? 0) > 99 ? "99+" : (data?.total ?? 0)} nhà hàng</span>
                            <span className="group-hover:translate-x-1.5 transition-transform duration-200">&rarr;</span>
                        </Link>
                    </FadeIn>
                </div>
            )}

            {/* Phân trang tại trang danh sách theo Chuẩn Senior Pro Max & Rule 6 */}
            {type === "page" && !!data?.total && (
                <div className="w-full mt-10 border-t border-gray-100/80 pt-4">
                    <Pagination
                        totalPages={Math.ceil((data?.total ? data.total / currentLimit : 0))}
                        currentPage={pageRestaurant || 1}
                        onPageChange={setPageRestaurant}
                        limit={currentLimit}
                        totalItems={data.total}
                        onLimitChange={setLimit}
                        itemLabel="nhà hàng"
                        limitOptions={[6, 9, 12, 18, 24, 30]}
                    />
                </div>
            )}

            {!data?.total && (
                <div className="w-full py-16 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl rounded-3xl border border-dashed border-gray-200 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl mb-3 shadow-inner">
                        🍽️
                    </div>
                    <p className="text-lg font-bold text-gray-800 mb-1">Không tìm thấy nhà hàng nào phù hợp</p>
                    <p className="text-sm text-gray-500 max-w-sm">Vui lòng thử điều chỉnh từ khóa tìm kiếm hoặc xóa bớt các bộ lọc.</p>
                </div>
            )}
        </div>
    );
};

export default Featured_Restaurant_Component;