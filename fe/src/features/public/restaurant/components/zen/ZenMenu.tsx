"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import { useGetPublicRestaurantMenu } from "@/src/features/public/restaurant/hook/useGetPublicRestaurantMenu";
import { useGetPublicMenuItems } from "@/src/features/public/restaurant/hook/useGetPublicMenuItems";
import { IPublicMenuCategory } from "@/src/features/public/restaurant/type/restaurant.public.type";
import useDebounce from "@/src/core/hooks/useDebounce";

interface Props {
    restaurantId: string;
}

const ZenMenu: React.FC<Props> = ({ restaurantId }) => {
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
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all ${currentPage === page ? 'bg-[#4d7c0f] text-white shadow-md' : 'border border-[#efece5] text-[#5c6655] hover:bg-[#f4f5f0]'}`}
            >
                {page}
            </button>
        ));
    };

    return (
        <div className="space-y-10 bg-[#fffaf0] p-6 sm:p-10 md:p-12 rounded-[40px] border border-[#efece5] shadow-sm">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-sans text-[#2c3e2e] inline-flex items-center gap-3">
                    <FaLeaf className="text-[#4d7c0f]" /> 
                    Thực Đơn Chay
                    <FaLeaf className="text-[#4d7c0f] scale-x-[-1]" />
                </h2>
                <p className="text-[#5c6655] mt-4 font-sans italic text-lg">Hương vị từ Mẹ thiên nhiên</p>
            </div>

            {/* Thanh công cụ */}
            <div className="bg-white p-4 rounded-full border border-[#efece5] shadow-[0_10px_30px_rgba(77,124,15,0.05)] flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <FiSearch className="text-[#4d7c0f]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm món ăn thanh tịnh..."
                        className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-[#2c3e2e] placeholder-[#a9af9f]"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto px-4 md:px-0">
                    <div className="w-px h-8 bg-[#efece5] hidden md:block"></div>
                    <div className="relative w-full md:w-48">
                        <select
                            value={activeMenuId}
                            onChange={(e) => {
                                setActiveMenuId(e.target.value);
                                setActiveCategoryId("all");
                                setCurrentPage(1);
                            }}
                            className="w-full pl-4 pr-8 py-3 bg-transparent border-none appearance-none focus:outline-none focus:ring-0 text-[#2c3e2e] cursor-pointer"
                        >
                            <option value="all">Tất cả thực đơn</option>
                            {menuData?.map(menu => (
                                <option key={menu.id} value={menu.id}>{menu.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-px h-8 bg-[#efece5] hidden md:block"></div>
                    <div className="relative w-full md:w-48">
                        <select
                            value={activeCategoryId}
                            onChange={(e) => {
                                setActiveCategoryId(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-4 pr-8 py-3 bg-transparent border-none appearance-none focus:outline-none focus:ring-0 text-[#2c3e2e] cursor-pointer"
                        >
                            <option value="all">Tất cả danh mục</option>
                            {availableCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Danh sách món ăn */}
            {isLoading && paginatedItems.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex p-4 bg-white rounded-3xl border border-[#efece5] gap-6">
                            <div className="w-32 h-32 bg-[#f4f5f0] rounded-2xl" />
                            <div className="flex-1 py-4">
                                <div className="h-4 bg-[#f4f5f0] rounded w-3/4 mb-4" />
                                <div className="h-3 bg-[#f4f5f0] rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : paginatedItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[#efece5] border-dashed">
                    <p className="text-[#5c6655] font-sans">Không tìm thấy món ăn nào.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                        {paginatedItems.map(item => (
                            <div key={item.id} className="group flex bg-white p-4 rounded-[32px] border border-[#efece5] shadow-[0_10px_40px_-10px_rgba(77,124,15,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(77,124,15,0.15)] transition-all duration-500 gap-6 cursor-pointer">
                                <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 rounded-[24px] overflow-hidden bg-[#f4f5f0]">
                                    <Image
                                        src={item.image || "/placeholder.jpg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Organic leaf overlay */}
                                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm text-[#4d7c0f]">
                                        <FaLeaf size={12} />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center flex-1 py-2 pr-2">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            {item.categoryName && (
                                                <span className="px-3 py-1 bg-[#f4f5f0] text-[#5c6655] rounded-full text-xs font-sans italic tracking-wide">{item.categoryName}</span>
                                            )}
                                        </div>
                                        <h4 className="font-sans font-bold text-[#2c3e2e] text-xl line-clamp-1 group-hover:text-[#4d7c0f] transition-colors">{item.name}</h4>
                                        <p className="text-sm text-[#5c6655] line-clamp-2 mt-2 leading-relaxed">{item.description}</p>
                                    </div>
                                    <div className="flex flex-col mt-4">
                                        {item.variants && item.variants.length > 0 ? (
                                            <>
                                                <div className="text-xs text-[#5c6655] mb-1">Từ <span className="text-[#654321] font-bold text-lg">{formatPrice(Math.min(...item.variants.map(v => v.price)))}</span></div>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.variants.map(v => (
                                                        <div key={v.id} className="px-2 py-0.5 bg-[#f4f5f0] rounded-md text-xs border border-[#efece5] text-[#5c6655]">
                                                            <span className="font-semibold">{v.name}:</span> <span className="text-[#654321] font-medium">{formatPrice(v.price)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <span className="font-sans font-bold text-[#654321] text-lg">
                                                {formatPrice(item.price)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="flex flex-col md:flex-row items-center justify-between mt-8 p-6 bg-white border border-[#efece5] rounded-[32px] shadow-sm gap-4">
                            <div className="text-sm text-[#5c6655] font-sans">
                                Hiển thị <span className="font-bold text-[#2c3e2e]">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> đến <span className="font-bold text-[#2c3e2e]">{Math.min(currentPage * itemsPerPage, totalItems)}</span> của <span className="font-bold text-[#2c3e2e]">{totalItems}</span> kết quả
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-center">
                                <div className="flex gap-2 items-center">
                                    <button 
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="w-10 h-10 flex items-center justify-center rounded-full border border-[#efece5] text-[#5c6655] hover:bg-[#f4f5f0] disabled:opacity-50 transition-all"
                                    >
                                        <FiChevronLeft className="w-5 h-5" />
                                    </button>
                                    
                                    {renderPaginationButtons()}
                                    
                                    <button 
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-10 h-10 flex items-center justify-center rounded-full border border-[#efece5] text-[#5c6655] hover:bg-[#f4f5f0] disabled:opacity-50 transition-all"
                                    >
                                        <FiChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ZenMenu;
