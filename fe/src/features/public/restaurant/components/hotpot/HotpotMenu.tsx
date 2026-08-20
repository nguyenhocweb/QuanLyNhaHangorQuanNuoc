"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { useGetPublicRestaurantMenu } from "@/src/features/public/restaurant/hook/useGetPublicRestaurantMenu";
import { useGetPublicMenuItems } from "@/src/features/public/restaurant/hook/useGetPublicMenuItems";
import { IPublicMenuCategory } from "@/src/features/public/restaurant/type/restaurant.public.type";
import useDebounce from "@/src/core/hooks/useDebounce";

interface HotpotMenuProps {
    restaurantId: string;
}

export default function HotpotMenu({ restaurantId }: HotpotMenuProps) {
    const { data: menuData } = useGetPublicRestaurantMenu(restaurantId);

    const [activeMenuId, setActiveMenuId] = useState<string>("all");
    const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    
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
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${currentPage === page ? 'bg-[#D32F2F] text-white shadow-[0_0_15px_rgba(211,47,47,0.4)]' : 'bg-[#232323] border border-[#333333] text-[#AAAAAA] hover:bg-[#2D1414] hover:text-[#F5F5F5] hover:border-[#D32F2F]'}`}
            >
                {page}
            </button>
        ));
    };

    return (
        <div className="bg-[#1A1A1A] rounded-2xl p-6 sm:p-10 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#333333] relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D32F2F] rounded-full -translate-y-1/2 translate-x-1/2 opacity-10 filter blur-[100px] pointer-events-none"></div>
            
            <div className="relative text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2D1414] border border-[#4A1C1C] text-[#D32F2F] mb-4 shadow-[0_0_20px_rgba(211,47,47,0.2)]">
                    <FaFire className="text-2xl" />
                </div>
                <h2 className="text-4xl font-extrabold text-white uppercase tracking-wider">Thực Đơn <span className="text-[#D32F2F]">Lửa Hồng</span></h2>
                <p className="text-[#AAAAAA] mt-3 font-sans max-w-md mx-auto">Tuyển tập các vị nước lẩu đặc sắc và hàng trăm món nhúng thượng hạng.</p>
            </div>

            {/* Thanh công cụ / Filters */}
            <div className="relative bg-[#232323] p-4 rounded-xl border border-[#333333] flex flex-col md:flex-row gap-4 items-center mb-10">
                <div className="relative flex-1 w-full bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden focus-within:border-[#D32F2F] focus-within:shadow-[0_0_10px_rgba(211,47,47,0.2)] transition-all">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="text-[#D32F2F]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm món nhúng, nước lẩu..."
                        className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-[#777777]"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-56 bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden focus-within:border-[#D32F2F] transition-all">
                        <select
                            value={activeMenuId}
                            onChange={(e) => {
                                setActiveMenuId(e.target.value);
                                setActiveCategoryId("all");
                                setCurrentPage(1);
                            }}
                            className="w-full pl-4 pr-10 py-3 bg-transparent border-none appearance-none focus:outline-none text-white font-medium cursor-pointer"
                        >
                            <option value="all" className="bg-[#1A1A1A]">Tất cả thực đơn</option>
                            {menuData?.map(menu => (
                                <option key={menu.id} value={menu.id} className="bg-[#1A1A1A]">{menu.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="relative w-full sm:w-56 bg-[#1A1A1A] rounded-lg border border-[#333333] overflow-hidden focus-within:border-[#D32F2F] transition-all">
                        <select
                            value={activeCategoryId}
                            onChange={(e) => {
                                setActiveCategoryId(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-4 pr-10 py-3 bg-transparent border-none appearance-none focus:outline-none text-white font-medium cursor-pointer"
                        >
                            <option value="all" className="bg-[#1A1A1A]">Tất cả danh mục</option>
                            {availableCategories.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-[#1A1A1A]">{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Danh sách món ăn - Dạng List Nằm Ngang */}
            {isLoading && paginatedItems.length === 0 ? (
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-[#333333] bg-[#232323]">
                            <div className="w-20 h-20 bg-[#333333] rounded-lg" />
                            <div className="flex-1 py-2">
                                <div className="h-6 bg-[#333333] rounded w-3/4 mb-3" />
                                <div className="h-4 bg-[#333333] rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : paginatedItems.length === 0 ? (
                <div className="relative text-center py-20 bg-[#232323] rounded-xl border border-[#333333] border-dashed">
                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-[#2D1414] text-[#D32F2F] mb-4">
                        <FaFire className="text-2xl opacity-50" />
                    </div>
                    <p className="text-[#AAAAAA] text-lg">Không tìm thấy món ăn nào phù hợp.</p>
                </div>
            ) : (
                <div className="relative space-y-8">
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                        {paginatedItems.map(item => (
                            <div key={item.id} className="group flex items-start gap-4 p-4 rounded-xl bg-[#232323] border border-[#333333] hover:border-[#D32F2F] hover:bg-[#2A1A1A] transition-all cursor-pointer shadow-sm hover:shadow-[0_5px_20px_rgba(211,47,47,0.15)]">
                                {/* Thumbnail */}
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-[#1A1A1A]">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-[#444444]">
                                            <FaFire className="text-3xl" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 py-1 flex flex-col h-full">
                                    <div className="flex justify-between items-start gap-2 mb-1">
                                        <h4 className="font-bold text-white text-lg truncate group-hover:text-[#D32F2F] transition-colors">
                                            {item.name}
                                        </h4>
                                        <div className="font-black text-[#FF7043] whitespace-nowrap text-lg">
                                            {item.variants && item.variants.length > 0 
                                                ? `Từ ${formatPrice(Math.min(...item.variants.map(v => v.price)))}`
                                                : formatPrice(item.price)
                                            }
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-[#AAAAAA] line-clamp-2 mb-3 flex-1">{item.description}</p>
                                    
                                    <div className="mt-auto flex flex-wrap gap-2 items-center">
                                        {item.categoryName && (
                                            <div className="inline-block px-2.5 py-1 bg-[#2D1414] border border-[#4A1C1C] text-[#FF7043] text-xs font-bold rounded">
                                                {item.categoryName}
                                            </div>
                                        )}
                                        
                                        {/* Variants */}
                                        {item.variants && item.variants.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 border-l border-[#444444] pl-2">
                                                {item.variants.map(v => (
                                                    <div key={v.id} className="text-xs px-2 py-1 rounded bg-[#1A1A1A] border border-[#333333] text-[#CCCCCC]">
                                                        {v.name}: <span className="text-[#FF7043] font-bold">{formatPrice(v.price)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="flex flex-col md:flex-row items-center justify-between mt-10 pt-6 border-t border-[#333333] gap-4">
                            <div className="text-sm text-[#AAAAAA]">
                                Đang xem <span className="font-bold text-white">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> - <span className="font-bold text-white">{Math.min(currentPage * itemsPerPage, totalItems)}</span> của <span className="font-bold text-white">{totalItems}</span> món
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#232323] border border-[#333333] text-[#AAAAAA] hover:bg-[#2D1414] hover:text-[#F5F5F5] hover:border-[#D32F2F] disabled:opacity-50 transition-all"
                                >
                                    <FiChevronLeft className="w-5 h-5" />
                                </button>
                                
                                {renderPaginationButtons()}
                                
                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#232323] border border-[#333333] text-[#AAAAAA] hover:bg-[#2D1414] hover:text-[#F5F5F5] hover:border-[#D32F2F] disabled:opacity-50 transition-all"
                                >
                                    <FiChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
