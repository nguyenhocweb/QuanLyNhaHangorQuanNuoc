"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useGetPublicRestaurantMenu } from "@/src/features/public/restaurant/hook/useGetPublicRestaurantMenu";
import { useGetPublicMenuItems } from "@/src/features/public/restaurant/hook/useGetPublicMenuItems";
import { IPublicMenuCategory } from "@/src/features/public/restaurant/type/restaurant.public.type";
import useDebounce from "@/src/core/hooks/useDebounce";
import FadeIn from "@/src/core/components/animation/FadeIn";

interface Props {
    restaurantId: string;
}

const LuxuryMenu: React.FC<Props> = ({ restaurantId }) => {
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
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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
                className={`w-8 h-8 flex items-center justify-center rounded-none text-sm font-sans transition-all border ${currentPage === page ? 'bg-yellow-600 text-black border-yellow-600' : 'border-[#333] text-zinc-400 hover:text-yellow-500 hover:border-yellow-500'}`}
            >
                {page}
            </button>
        ));
    };

    return (
        <div className="py-16">
            <h2 className="text-3xl font-sans text-white text-center mb-12 tracking-wide">Thực đơn</h2>

            {/* Elegant Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 border-b border-[#222] pb-8">
                
                {/* Search Bar */}
                <div className="relative w-full md:flex-1 md:max-w-md">
                    <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm món ăn..."
                        className="w-full pl-8 pr-0 py-2 bg-transparent border-b border-[#333] focus:border-yellow-600 focus:outline-none transition-all text-sm font-sans text-zinc-300 placeholder:text-zinc-600"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                    {/* Menu Dropdown */}
                    <div className="relative w-full sm:w-48">
                        <FiFilter className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <select
                            value={activeMenuId}
                            onChange={(e) => {
                                setActiveMenuId(e.target.value);
                                setActiveCategoryId("all");
                                setCurrentPage(1);
                            }}
                            className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-[#333] focus:border-yellow-600 focus:outline-none transition-all text-sm font-sans text-zinc-300 appearance-none cursor-pointer"
                        >
                            <option value="all" className="bg-[#111]">Tất cả thực đơn</option>
                            {menuData?.map(menu => (
                                <option key={menu.id} value={menu.id} className="bg-[#111]">{menu.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Category Dropdown */}
                    <div className="relative w-full sm:w-48">
                        <FiFilter className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <select
                            value={activeCategoryId}
                            onChange={(e) => {
                                setActiveCategoryId(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-[#333] focus:border-yellow-600 focus:outline-none transition-all text-sm font-sans text-zinc-300 appearance-none cursor-pointer"
                        >
                            <option value="all" className="bg-[#111]">Tất cả danh mục</option>
                            {availableCategories.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-[#111]">{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Menu Items - Fine Dining List Style */}
            {isLoading && paginatedItems.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="flex gap-6 border-b border-[#222] pb-6">
                            <div className="w-24 h-24 bg-[#222]" />
                            <div className="flex-1 space-y-4 py-2">
                                <div className="h-4 bg-[#222] w-1/3" />
                                <div className="h-4 bg-[#111] w-2/3" />
                                <div className="h-3 bg-[#111] w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : paginatedItems.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-zinc-500 font-sans italic">Không tìm thấy món ăn phù hợp.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {paginatedItems.map((item, idx) => (
                        <FadeIn key={item.id} delay={0.1 * (idx % 6)}>
                            <div className="group flex gap-4 sm:gap-6 items-start pb-6 border-b border-[#222]">
                                {/* Image */}
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 border border-[#333] p-1 bg-[#0a0a0a]">
                                    <div className="relative w-full h-full overflow-hidden">
                                        <Image
                                            src={item.image || "/placeholder.jpg"}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex-1 flex flex-col justify-between min-h-full">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            {item.menuName && (
                                                <span className="text-[10px] uppercase tracking-widest text-yellow-600 border border-yellow-600/30 px-2 py-0.5">{item.menuName}</span>
                                            )}
                                            {item.categoryName && (
                                                <span className="text-[10px] uppercase tracking-widest text-zinc-400 border border-[#333] px-2 py-0.5">{item.categoryName}</span>
                                            )}
                                        </div>
                                        
                                        <div className="flex justify-between items-baseline gap-4 mb-1">
                                            <h4 className="font-sans text-lg text-zinc-200 group-hover:text-yellow-500 transition-colors line-clamp-1">
                                                {item.name}
                                            </h4>
                                            <div className="flex-1 border-b border-dotted border-[#333] mx-2 relative top-[-6px]" />
                                            <span className="font-sans text-yellow-600 text-lg whitespace-nowrap">
                                                {item.variants && item.variants.length > 0 
                                                    ? `Từ ${formatPrice(Math.min(...item.variants.map(v => v.price)))}`
                                                    : formatPrice(item.price)
                                                }
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-zinc-500 font-sans font-light leading-relaxed line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>
                                    
                                    {/* Variants */}
                                    {item.variants && item.variants.length > 0 && (
                                        <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-[#111]">
                                            {item.variants.map(v => (
                                                <div key={v.id} className="flex items-center gap-1.5 text-xs font-sans text-zinc-400">
                                                    <span className="text-zinc-300">{v.name}:</span>
                                                    <span>{formatPrice(v.price)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 0 && (
                <div className="flex flex-col md:flex-row items-center justify-between mt-16 pt-8 border-t border-[#222] gap-6">
                    <div className="text-sm font-sans text-zinc-500">
                        Hiển thị <span className="text-zinc-300">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> đến <span className="text-zinc-300">{Math.min(currentPage * itemsPerPage, totalItems)}</span> của <span className="text-zinc-300">{totalItems}</span> kết quả
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 justify-center">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-sans text-zinc-500">Hiển thị:</span>
                            <select 
                                value={itemsPerPage} 
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="bg-transparent border-b border-[#333] text-zinc-300 font-sans text-sm py-1 focus:border-yellow-600 focus:outline-none cursor-pointer"
                            >
                                <option value={6} className="bg-[#111]">6 món</option>
                                <option value={12} className="bg-[#111]">12 món</option>
                                <option value={24} className="bg-[#111]">24 món</option>
                                <option value={48} className="bg-[#111]">48 món</option>
                            </select>
                        </div>
                        
                        <div className="flex gap-1.5 items-center">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex flex-col justify-center items-center border border-[#333] text-zinc-500 hover:text-yellow-500 hover:border-yellow-500 disabled:opacity-30 disabled:hover:border-[#333] disabled:hover:text-zinc-500 transition-all"
                            >
                                <FiChevronLeft />
                            </button>
                            {renderPaginationButtons()}
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 flex flex-col justify-center items-center border border-[#333] text-zinc-500 hover:text-yellow-500 hover:border-yellow-500 disabled:opacity-30 disabled:hover:border-[#333] disabled:hover:text-zinc-500 transition-all"
                            >
                                <FiChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LuxuryMenu;
