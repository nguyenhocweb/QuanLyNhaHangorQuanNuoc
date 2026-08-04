"use client";

import React from "react";
import Link from "next/link";
import Brand_Card from "./brand-card-components";
import { Div, P } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useBrandCard_hook } from "../hooks/useBrandCard_hook";
import Loading from "@/src/core/components/layout/public-loading";
import Pagination from "@/src/core/components/layout/Pagination";
import { usePagination } from "@/src/core/hooks/usePagination";
import { usePerformanceMode } from "@/src/core/hooks/usePerformanceMode";

const featuredBrandComponent = ({ type }: { type: "home" | "page" }) => {
    const { currentPage, setPage, searchKeyword, city, brandFilter, limit, setLimit } = usePagination();
    const currentLimit = type === "home" ? 3 : (limit || 6);
    const isFeatured = brandFilter === "vip" ? true : undefined;
    const isNew = brandFilter === "hot" ? true : undefined;

    const { data, isLoading } = useBrandCard_hook({
        page: currentPage,
        limit: currentLimit,
        search: searchKeyword ?? undefined,
        city: city ?? undefined,
        isFeatured,
        isNew
    });
    const { is3D } = usePerformanceMode();

    if (isLoading) return <Loading />;

    const brandList = data?.data ?? [];

    return (
        <div id="brandHome" className="w-full relative flex flex-col gap-6">
            {/* Hào quang tím (Purple Aura) 3D khi bật hiệu năng cao */}
            {is3D && type === "home" && (
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-pink-500/10 rounded-3xl blur-3xl pointer-events-none" />
            )}

            {/* Chỉ hiển thị tiêu đề nếu KHÔNG phải ở trang home */}
            {type !== "home" && (
                <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6 mb-2">
                    <div className="flex flex-col gap-2">
                        <FadeIn>
                            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200/60 shadow-xs inline-block w-fit">
                                👑 ĐỐI TÁC CHIẾN LƯỢC
                            </span>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                                Thương hiệu <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">Đối tác VIP</span>
                            </h1>
                        </FadeIn>
                    </div>
                    <FadeIn delay={0.2}>
                        <p className="text-sm text-gray-500 max-w-md">
                            Khám phá mạng lưới thương hiệu ẩm thực hàng đầu với đặc quyền đặt bàn nhanh chóng và ưu đãi độc quyền.
                        </p>
                    </FadeIn>
                </div>
            )}

            {type === "home" && (
                <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                    <div className="flex flex-col gap-2">
                        <FadeIn>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 inline-block w-fit">
                                👑 ĐỐI TÁC CHIẾN LƯỢC
                            </span>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h1 className="text-3xl font-extrabold text-gray-900">
                                Thương hiệu <span className="text-purple-600">Đối tác VIP</span>
                            </h1>
                        </FadeIn>
                    </div>
                    <FadeIn delay={0.2}>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Mỗi nhà hàng là một câu chuyện về hương vị và sự sáng tạo ẩm thực không giới hạn.
                        </p>
                    </FadeIn>
                </div>
            )}

            {/* Bố cục Lưới 3 Cột Responsive Chuẩn Senior Pro Max */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch relative z-10">
                {brandList.map((e, index) => (
                    <Brand_Card key={e.id} dataBrand={e} index={index} />
                ))}
            </div>

            {/* Nút Khám phá Glowing Pill chuẩn Senior Pro Max trên Trang chủ */}
            {type === "home" && !!data?.total && (
                <div className="w-full flex justify-center mt-6 relative z-10">
                    <FadeIn delay={0.4}>
                        <Link
                            href="/brands"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gray-900 via-slate-800 to-black hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold text-sm tracking-wide shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-300 group"
                        >
                            <span>👑 Khám phá toàn bộ {(data?.total ?? 0) > 99 ? "99+" : (data?.total ?? 0)} thương hiệu</span>
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
                        currentPage={currentPage}
                        onPageChange={setPage}
                        limit={currentLimit}
                        totalItems={data.total}
                        onLimitChange={setLimit}
                        itemLabel="thương hiệu"
                        limitOptions={[6, 9, 12, 18, 24, 30]}
                    />
                </div>
            )}

            {!data?.total && (
                <div className="w-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                    <p className="text-base font-bold text-gray-700 mb-1">Không tìm thấy thương hiệu nào</p>
                    <p className="text-xs text-gray-400">Vui lòng thử bộ lọc tìm kiếm khác.</p>
                </div>
            )}
        </div>
    );
};

export default featuredBrandComponent;