"use client";

import React from "react";
import Link from "next/link";
import Card_Dish_Components from "./card-dish-component";
import Card_Brand_Dish_Components from "./card-brand-dish-component";
import { Div, P } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useDishCard_hook } from "../dish_hook/useDishCard_hook";
import Loading from "@/src/core/components/layout/public-loading";
import { usePagination } from "@/src/core/hooks/usePagination";
import Pagination from "@/src/core/components/layout/Pagination";
import { usePerformanceMode } from "@/src/core/hooks/usePerformanceMode";

const FeaturedDishComponent = ({
    type,
    id,
    limit,
    grid
}: {
    type: "home" | "isBrand" | "isRestaurant";
    id?: string;
    limit?: number;
    grid?: number;
}) => {
    const { MenuItemPage, searchKeyword, setMenuItemPage } = usePagination();
    const limits = limit ?? (type === "home" ? 3 : 10);
    const { data, isLoading } = useDishCard_hook({
        type,
        limit: limits,
        page: MenuItemPage,
        search: searchKeyword ?? undefined,
        id: id || undefined
    });
    const { is3D } = usePerformanceMode();

    if (isLoading) return <Loading />;

    const dishList = data?.data ?? [];

    return (
        <div className="w-full relative flex flex-col gap-6">
            {/* Hào quang vàng cam/xanh (Amber/Emerald Aura) 3D khi bật hiệu năng cao */}
            {is3D && type === "home" && (
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-emerald-500/10 rounded-3xl blur-3xl pointer-events-none" />
            )}

            {/* Chỉ hiển thị tiêu đề và mô tả dài dòng nếu KHÔNG phải ở trang home */}
            {type !== "home" && (
                <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6 mb-2">
                    <div className="flex flex-col gap-2">
                        <FadeIn>
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit">
                                🔥 Thực đơn Đặc sắc
                            </span>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h1 className="text-3xl font-extrabold text-gray-900">
                                {type === "isBrand" ? "Món ăn Mới nhất của Thương hiệu" : "Thực đơn Món ăn Yêu thích"}
                            </h1>
                        </FadeIn>
                    </div>
                    <FadeIn delay={0.2}>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Khám phá hương vị tuyệt hảo từ các món ăn truyền thống đến những sáng tạo ẩm thực độc đáo.
                        </p>
                    </FadeIn>
                </div>
            )}

            {/* Bố cục Lưới 3 Cột Responsive Chuẩn Senior Pro Max */}
            <div className={`w-full grid grid-cols-1 sm:grid-cols-2 ${grid === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"} gap-6 sm:gap-8 items-stretch relative z-10`}>
                {dishList.map((e, index) => (
                    type === "isBrand" ? (
                        <Card_Brand_Dish_Components key={e.id} dataDish={e as any} index={index} />
                    ) : (
                        <Card_Dish_Components key={e.id} dataDish={e as any} index={index} />
                    )
                ))}
            </div>

            {/* Nút Khám phá Glowing Pill chuẩn Senior Pro Max trên Trang chủ */}
            {type === "home" && !!data?.total && (
                <div className="w-full flex justify-center mt-6 relative z-10">
                    <FadeIn delay={0.4}>
                        <Link
                            href="/dishes"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gray-900 via-slate-800 to-black hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm tracking-wide shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-300 group"
                        >
                            <span>🔥 Khám phá toàn bộ {(data?.total ?? 0) > 99 ? "99+" : (data?.total ?? 0)} món ăn</span>
                            <span className="group-hover:translate-x-1.5 transition-transform duration-200">&rarr;</span>
                        </Link>
                    </FadeIn>
                </div>
            )}

            {/* Phân trang khi ở trang chi tiết thương hiệu hoặc nhà hàng */}
            {type !== "home" && !!data?.total && (
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between px-4 gap-4 border-t border-gray-100 pt-6">
                    <P variant="text_black" className="font-semibold">
                        Hiển thị {dishList.length} của {data.total} món ăn
                    </P>
                    {data.total > limits && (
                        <Pagination
                            totalPages={Math.ceil((data?.total ? data.total / limits : 0))}
                            currentPage={MenuItemPage ?? 1}
                            limit={limits}
                            onPageChange={setMenuItemPage}
                        />
                    )}
                </div>
            )}

            {!dishList.length && (
                <div className="w-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                    <p className="text-base font-bold text-gray-700 mb-1">Không tìm thấy món ăn nào</p>
                    <p className="text-xs text-gray-400">Vui lòng quay lại hoặc chọn danh mục thực đơn khác.</p>
                </div>
            )}
        </div>
    );
};

export default FeaturedDishComponent;