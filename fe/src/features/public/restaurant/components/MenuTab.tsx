"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useGetPublicRestaurantMenu } from "../hook/useGetPublicRestaurantMenu";
import { useGetPublicMenuItems } from "../hook/useGetPublicMenuItems";
import { IPublicMenuCategory } from "../type/restaurant.public.type";
import useDebounce from "@/src/core/hooks/useDebounce";

interface Props {
    restaurantId: string;
}

const MenuTab: React.FC<Props> = ({ restaurantId }) => {
    // Lấy danh sách Menu và Categories để render Dropdown Filter
    const { data: menuData } = useGetPublicRestaurantMenu(restaurantId);

    const [activeMenuId, setActiveMenuId] = useState<string>("all");
    const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    
    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    
    const debouncedSearch = useDebounce({ value: searchTerm, delay: 500 });

    // Gọi API lấy Items có phân trang và filter
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

    // Trích xuất tất cả các Category của Menu Đang Chọn (để render Select Options)
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

    // Loading State
    if (isLoading && paginatedItems.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="flex p-4 bg-white rounded-2xl border border-gray-100 shadow-sm gap-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-xl" />
                        <div className="flex-1 space-y-3 py-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="h-5 bg-gray-200 rounded w-1/4 mt-4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Helper render pagination buttons
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
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${currentPage === page ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-600' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
                {page}
            </button>
        ));
    };

    return (
        <div className="space-y-6">
            {/* Thanh công cụ: Search & Select Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center relative z-10">
                {isLoading && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 rounded-t-2xl overflow-hidden">
                        <div className="h-full bg-indigo-500 animate-pulse rounded-t-2xl"></div>
                    </div>
                )}
                
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm món ăn..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Lọc Thực đơn (Select) */}
                    <div className="relative w-full md:w-48">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            value={activeMenuId}
                            onChange={(e) => {
                                setActiveMenuId(e.target.value);
                                setActiveCategoryId("all"); // Reset category khi đổi menu
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-700 transition-all cursor-pointer"
                        >
                            <option value="all">Tất cả thực đơn</option>
                            {menuData?.map(menu => (
                                <option key={menu.id} value={menu.id}>{menu.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Lọc Danh mục (Select) */}
                    <div className="relative w-full md:w-48">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            value={activeCategoryId}
                            onChange={(e) => {
                                setActiveCategoryId(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-700 transition-all cursor-pointer"
                        >
                            <option value="all">Tất cả danh mục</option>
                            {availableCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Hiển thị danh sách món ăn (Grid) */}
            {paginatedItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
                    <p className="text-gray-500">Không tìm thấy món ăn nào phù hợp với tìm kiếm.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                        {paginatedItems.map(item => (
                            <div key={item.id} className="group flex bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 gap-4 cursor-pointer relative overflow-hidden">
                                <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                    <Image
                                        src={item.image || "/placeholder.jpg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-between flex-1 py-1">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            {/* Badge Categories */}
                                            {item.menuName && (
                                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-semibold uppercase tracking-wider">{item.menuName}</span>
                                            )}
                                            {item.categoryName && (
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-semibold uppercase tracking-wider">{item.categoryName}</span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                                    </div>
                                    <div className="flex flex-col mt-3">
                                        {item.variants && item.variants.length > 0 ? (
                                            <>
                                                <div className="text-xs text-gray-400 mb-1">Từ <span className="text-gray-900 font-bold text-lg">{formatPrice(Math.min(...item.variants.map(v => v.price)))}</span></div>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.variants.map(v => (
                                                        <div key={v.id} className="px-2 py-0.5 bg-gray-50 rounded text-xs border border-gray-100 text-gray-600">
                                                            <span className="font-semibold">{v.name}:</span> <span className="text-gray-900 font-medium">{formatPrice(v.price)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <span className="font-extrabold text-gray-900 text-lg">
                                                {formatPrice(item.price)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination UI */}
                    {totalPages > 0 && (
                        <div className="flex flex-col md:flex-row items-center justify-between mt-8 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm gap-4">
                            <div className="text-sm text-gray-500">
                                Hiển thị <span className="font-semibold text-gray-700">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> đến <span className="font-semibold text-gray-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> của <span className="font-semibold text-gray-700">{totalItems}</span> kết quả
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Hiển thị:</span>
                                    <select 
                                        value={itemsPerPage} 
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 font-medium cursor-pointer"
                                    >
                                        <option value={6}>6 món</option>
                                        <option value={12}>12 món</option>
                                        <option value={24}>24 món</option>
                                        <option value={48}>48 món</option>
                                    </select>
                                </div>
                                
                                <div className="flex gap-1.5 items-center">
                                    <button 
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-1.5 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-all"
                                    >
                                        <FiChevronLeft className="w-5 h-5" />
                                    </button>
                                    
                                    {renderPaginationButtons()}
                                    
                                    <button 
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-1.5 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-all"
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

export default MenuTab;
