"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import { useGetPublicRestaurantMenu } from "@/src/features/public/restaurant/hook/useGetPublicRestaurantMenu";
import { useGetPublicMenuItems } from "@/src/features/public/restaurant/hook/useGetPublicMenuItems";
import { IPublicMenuCategory } from "@/src/features/public/restaurant/type/restaurant.public.type";
import useDebounce from "@/src/core/hooks/useDebounce";

interface IceCreamMenuProps {
    restaurantId: string;
}

export default function IceCreamMenu({ restaurantId }: IceCreamMenuProps) {
    const { data: menuData } = useGetPublicRestaurantMenu(restaurantId);

    const [activeMenuId, setActiveMenuId] = useState<string>("all");
    const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    
    const debouncedSearch = useDebounce({ value: searchTerm, delay: 500 });

    const { data: itemsResponse, isLoading } = useGetPublicMenuItems({
        restaurantId,
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        menuId: activeMenuId,
        categoryId: activeCategoryId
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const availableCategories = useMemo(() => {
        if (!menuData) return [];
        let menusToExtract = menuData;
        if (activeMenuId !== "all") {
            menusToExtract = menusToExtract.filter(m => m.id === activeMenuId);
        }
        
        const catMap = new Map<string, IPublicMenuCategory>();
        menusToExtract.forEach(m => {
            m.menucategory.forEach(c => {
                if (c.items && c.items.length > 0) {
                    catMap.set(c.id, c);
                }
            });
        });
        return Array.from(catMap.values());
    }, [menuData, activeMenuId]);

    const totalPages = itemsResponse?.totalPages || 1;
    const paginatedItems = itemsResponse?.data || [];
    const totalItems = itemsResponse?.total || 0;

    const renderPaginationButtons = () => {
        let pages = [];
        if (totalPages <= 5) {
            pages = Array.from({ length: totalPages }).map((_, i) => i + 1);
        } else {
            if (currentPage <= 3) {
                pages = [1, 2, 3, 4, 5];
            } else if (currentPage >= totalPages - 2) {
                pages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
            }
        }

        return pages.map(page => (
            <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${currentPage === page ? 'bg-[#FF8BA7] text-white shadow-md' : 'border-2 border-[#FFE3E9] text-[#8D6E63] hover:bg-[#FFF0F3]'}`}
            >
                {page}
            </button>
        ));
    };

    return (
        <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-[0_10px_40px_-10px_rgba(255,139,167,0.15)] border-[3px] border-[#FFF0F3] relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFF0F3] text-[#FF8BA7] font-bold text-sm border border-[#FFE3E9] mb-4">
                        <FaUtensils className="text-lg" />
                        <span className="uppercase tracking-wider">Thực đơn</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-[#5D4037] font-sans">Thực Đơn Nhà Hàng</h2>
                </div>

                <div className="relative max-w-sm w-full">
                    <input
                        type="text"
                        placeholder="Tìm kiếm món ăn..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-[#FFE3E9] focus:outline-none focus:border-[#FF8BA7] bg-[#FFF8F0] text-[#5D4037] placeholder-[#8D6E63]"
                    />
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF8BA7] w-5 h-5" />
                </div>
            </div>

            {/* Filters (Menu & Category) */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative w-full md:w-64 bg-[#FFF8F0] rounded-full border-2 border-[#FFE3E9] overflow-hidden focus-within:border-[#FF8BA7]">
                    <select
                        value={activeMenuId}
                        onChange={(e) => {
                            setActiveMenuId(e.target.value);
                            setActiveCategoryId("all");
                            setCurrentPage(1);
                        }}
                        className="w-full pl-6 pr-10 py-3 bg-transparent border-none appearance-none focus:outline-none text-[#5D4037] font-bold cursor-pointer"
                    >
                        <option value="all">Tất cả thực đơn</option>
                        {menuData?.map(menu => (
                            <option key={menu.id} value={menu.id}>{menu.name}</option>
                        ))}
                    </select>
                </div>
                
                <div className="relative w-full md:w-64 bg-[#FFF8F0] rounded-full border-2 border-[#FFE3E9] overflow-hidden focus-within:border-[#FF8BA7]">
                    <select
                        value={activeCategoryId}
                        onChange={(e) => {
                            setActiveCategoryId(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-6 pr-10 py-3 bg-transparent border-none appearance-none focus:outline-none text-[#5D4037] font-bold cursor-pointer"
                    >
                        <option value="all">Tất cả danh mục</option>
                        {availableCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Menu Grid */}
            {isLoading && paginatedItems.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-72 bg-[#FFF8F0] rounded-3xl border-2 border-[#FFE3E9]"></div>
                    ))}
                </div>
            ) : paginatedItems.length === 0 ? (
                <div className="py-20 text-center">
                    <div className="inline-flex w-20 h-20 bg-[#FFF0F3] text-[#FF8BA7] rounded-full items-center justify-center mb-4">
                        <FaUtensils className="text-3xl opacity-50" />
                    </div>
                    <p className="text-[#8D6E63] text-lg font-medium">Không tìm thấy món ăn nào phù hợp.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedItems.map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-white rounded-3xl overflow-hidden border-2 border-[#FFE3E9] shadow-sm hover:shadow-[0_10px_30px_rgba(255,139,167,0.2)] hover:-translate-y-2 transition-all duration-300 flex flex-col group cursor-pointer"
                        >
                            {/* Image */}
                            <div className="relative h-48 w-full bg-[#FFF8F0] overflow-hidden">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-[#FFC4D1]">
                                        <FaUtensils className="w-16 h-16 opacity-50" />
                                    </div>
                                )}
                                {/* Decorative bottom wave for image */}
                                <div className="absolute bottom-[-1px] left-0 w-full leading-[0] text-white">
                                    <svg viewBox="0 0 1440 120" className="w-full h-8 fill-current" preserveAspectRatio="none">
                                        <path d="M0,60 C480,120 960,0 1440,60 L1440,120 L0,120 Z"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h4 className="font-bold text-[#5D4037] text-xl mb-2 group-hover:text-[#FF8BA7] transition-colors">
                                    {item.name}
                                </h4>
                                
                                <p className="text-sm text-[#8D6E63] line-clamp-2 mb-4 flex-1">
                                    {item.description}
                                </p>

                                <div className="mt-auto">
                                    {/* Base Price */}
                                    <div className="font-sans font-extrabold text-[#FF8BA7] text-xl mb-3">
                                        {item.variants && item.variants.length > 0 
                                            ? `Từ ${formatPrice(Math.min(...item.variants.map(v => v.price)))}`
                                            : formatPrice(item.price)
                                        }
                                    </div>

                                    {/* Variants / Sizes */}
                                    {item.variants && item.variants.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-3 border-t border-dashed border-[#FFE3E9]">
                                            {item.variants.map(v => (
                                                <div key={v.id} className="bg-[#FFF0F3] text-[#5D4037] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#FFE3E9]">
                                                    {v.name}: <span className="text-[#FF8BA7]">{formatPrice(v.price)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 0 && (
                <div className="flex flex-col md:flex-row items-center justify-between mt-10 pt-6 border-t border-[#FFE3E9] gap-4">
                    <div className="text-sm text-[#8D6E63] font-sans">
                        Đang xem <span className="font-bold text-[#5D4037]">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> - <span className="font-bold text-[#5D4037]">{Math.min(currentPage * itemsPerPage, totalItems)}</span> của <span className="font-bold text-[#5D4037]">{totalItems}</span> món
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#FFE3E9] text-[#FF8BA7] hover:bg-[#FFF0F3] disabled:opacity-50 transition-all"
                        >
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                        
                        {renderPaginationButtons()}
                        
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#FFE3E9] text-[#FF8BA7] hover:bg-[#FFF0F3] disabled:opacity-50 transition-all"
                        >
                            <FiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
