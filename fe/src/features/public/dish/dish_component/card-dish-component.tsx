"use client";

import React from "react";
import Link from "next/link";
import { Card_Dish_Type } from "../dish_type/card_dish_type";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { MdStorefront } from "react-icons/md";
import { FaFire } from "react-icons/fa";

const Card_Dish_Components = ({
    dataDish,
    index
}: {
    dataDish: Card_Dish_Type;
    index: number;
}) => {
    const formattedPrice = new Intl.NumberFormat("vi-VN").format(Number(dataDish.base_price || 0));
    const providerName = dataDish.restaurantName || dataDish.brandName || "Thực đơn NVNguyen";

    return (
        <FadeIn delay={(index % 6) * 0.1} className="w-full h-full">
            <div className="w-full h-full flex flex-col justify-between bg-white rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200 transition-all duration-300 overflow-hidden group">
                {/* Header Hình ảnh Món ăn */}
                <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                    <img
                        src={`${dataDish.image}?auto=format&fit=crop&w=800&q=80`}
                        alt={dataDish.name || "Món ăn NVNguyen"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Huy hiệu Hot / Bán chạy */}
                    {dataDish.is_featured && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 animate-pulse">
                            <FaFire className="text-yellow-200" />
                            <span>Món Bán Chạy</span>
                        </div>
                    )}

                    {/* Huy hiệu Giá niêm yết góc trái ảnh */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md border border-gray-100/80 flex items-baseline">
                        <span className="text-[10px] font-bold text-gray-500 mr-1">Từ</span>
                        <span className="text-sm font-extrabold text-emerald-600">{formattedPrice}</span>
                        <span className="text-[10px] font-bold text-gray-500 ml-0.5">đ</span>
                    </div>

                    {/* Nhãn nhà hàng bên phải ảnh */}
                    <div className="absolute bottom-3 right-3 max-w-[55%]">
                        <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md truncate max-w-full">
                            <MdStorefront className="text-emerald-400 flex-shrink-0" />
                            <span className="truncate">{providerName}</span>
                        </span>
                    </div>
                </div>

                {/* Nội dung chi tiết món ăn */}
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Link href={`/dishes/${dataDish.id}`} className="block group/link">
                            <h3 className="font-extrabold text-gray-900 text-base line-clamp-1 group-hover/link:text-emerald-600 transition-colors">
                                {dataDish.name || "Món ăn Đặc sắc"}
                            </h3>
                        </Link>

                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[32px]">
                            {dataDish.description || "Hương vị tuyệt hảo được chế biến bởi bếp trưởng giàu kinh nghiệm của NVNguyen."}
                        </p>

                        {/* Variants / Sizes */}
                        {dataDish.variants && dataDish.variants.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                {dataDish.variants.slice(0, 3).map((variant, idx) => (
                                    <span key={idx} className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100/50">
                                        {variant.name}: {new Intl.NumberFormat("vi-VN").format(Number(variant.price))}đ
                                    </span>
                                ))}
                                {dataDish.variants.length > 3 && (
                                    <span className="text-[10px] font-medium text-gray-400 px-1 py-0.5">...</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Nút bấm */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <Link
                            href={`/dishes/${dataDish.id}`}
                            className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 text-xs font-bold text-center border border-gray-200/60 hover:border-emerald-200 transition-all duration-200 flex items-center justify-center gap-1"
                        >
                            <span>🍽️ Xem món & Đặt ngay</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};

export default Card_Dish_Components;