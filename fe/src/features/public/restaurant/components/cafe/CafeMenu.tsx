"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaCoffee } from "react-icons/fa";
import { useGetPublicRestaurantMenu } from "@/src/features/public/restaurant/hook/useGetPublicRestaurantMenu";
import { useGetPublicMenuItems } from "@/src/features/public/restaurant/hook/useGetPublicMenuItems";
import { IPublicMenuCategory } from "@/src/features/public/restaurant/type/restaurant.public.type";
import useDebounce from "@/src/core/hooks/useDebounce";

interface Props {
    restaurantId: string;
}

const CafeMenu: React.FC<Props> = ({ restaurantId }) => {
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
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${currentPage === page ? 'bg-[#8B5A2B] text-white shadow-md' : 'border border-[#EFE6DD] text-[#6E5C53] hover:bg-[#FAF5F0]'}`}
            >
                {page}
            </button>
        ));
    };

    return (
        <div className="space-y-10 bg-white p-6 sm:p-10 md:p-12 rounded-[24px] border border-[#F0EAE1] shadow-sm relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF5F0] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FAF5F0] rounded-full translate-y-1/2 -translate-x-1/2 opacity-50 pointer-events-none"></div>

            <div className="relative text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FAF5F0] text-[#8B5A2B] mb-4 shadow-sm">
                    <FaCoffee className="text-2xl" />
                </div>
                <h2 className="text-4xl font-serif text-[#3B3131]">Thực Đơn Quán</h2>
                <p className="text-[#6E5C53] mt-3 font-sans max-w-md mx-auto">Khám phá những thức uống đặc trưng và bánh ngọt hấp dẫn của chúng tôi.</p>
            </div>

            {/* Thanh công cụ */}
            <div className="relative bg-[#FAF5F0] p-3 rounded-2xl border border-[#EFE6DD] flex flex-col md:flex-row gap-3 items-center shadow-inner">
                <div className="relative flex-1 w-full bg-white rounded-xl border border-[#EFE6DD] overflow-hidden transition-shadow focus-within:ring-2 focus-within:ring-[#8B5A2B]/20 focus-within:border-[#8B5A2B]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="text-[#8B5A2B]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm đồ uống..."
                        className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-[#3B3131] placeholder-[#A99D95]"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-48 bg-white rounded-xl border border-[#EFE6DD] overflow-hidden focus-within:ring-2 focus-within:ring-[#8B5A2B]/20">
                        <select
                            value={activeMenuId}
                            onChange={(e) => {
                                setActiveMenuId(e.target.value);
                                setActiveCategoryId("all");
                                setCurrentPage(1);
                            }}
                            className="w-full pl-4 pr-8 py-3 bg-transparent border-none appearance-none focus:outline-none focus:ring-0 text-[#3B3131] cursor-pointer"
                        >
                            <option value="all">Tất cả thực đơn</option>
                            {menuData?.map(menu => (
                                <option key={menu.id} value={menu.id}>{menu.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="relative w-full sm:w-48 bg-white rounded-xl border border-[#EFE6DD] overflow-hidden focus-within:ring-2 focus-within:ring-[#8B5A2B]/20">
                        <select
                            value={activeCategoryId}
                            onChange={(e) => {
                                setActiveCategoryId(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-4 pr-8 py-3 bg-transparent border-none appearance-none focus:outline-none focus:ring-0 text-[#3B3131] cursor-pointer"
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
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[#F0EAE1] rounded-full" />
                            <div className="flex-1 py-2">
                                <div className="h-5 bg-[#F0EAE1] rounded w-3/4 mb-2" />
                                <div className="h-3 bg-[#F0EAE1] rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : paginatedItems.length === 0 ? (
                <div className="relative text-center py-20 bg-[#FAF5F0] rounded-2xl border border-[#EFE6DD] border-dashed">
                    <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-white text-[#DCCCBD] mb-3">
                        <FaCoffee />
                    </div>
                    <p className="text-[#6E5C53] font-sans">Không tìm thấy thức uống nào.</p>
                </div>
            ) : (
                <div className="relative space-y-10">
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                        {paginatedItems.map(item => (
                            <div key={item.id} className="group flex items-start gap-4 cursor-pointer">
                                <div className="relative w-20 h-20 flex-shrink-0 rounded-full overflow-hidden bg-[#FAF5F0] border-2 border-[#EFE6DD] group-hover:border-[#8B5A2B] transition-colors shadow-sm">
                                    <Image
                                        src={item.image || "/placeholder.jpg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex items-baseline justify-between w-full">
                                        <h4 className="font-serif font-bold text-[#3B3131] text-lg lg:text-xl truncate group-hover:text-[#8B5A2B] transition-colors bg-white pr-2">
                                            {item.name}
                                        </h4>
                                        <div className="flex-grow border-b-2 border-dotted border-[#DCCCBD] mx-2 relative -top-2 hidden sm:block opacity-60"></div>
                                        <div className="font-sans font-bold text-[#8B5A2B] text-lg bg-white pl-2 whitespace-nowrap">
                                            {item.variants && item.variants.length > 0 
                                                ? `Từ ${formatPrice(Math.min(...item.variants.map(v => v.price)))}`
                                                : formatPrice(item.price)
                                            }
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#6E5C53] line-clamp-2 mt-1 pr-4">{item.description}</p>
                                    
                                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                                        {/* Category tag */}
                                        {item.categoryName && (
                                            <div className="inline-block px-2 py-0.5 bg-[#FAF5F0] border border-[#EFE6DD] text-[#8B5A2B] text-xs rounded uppercase tracking-wider">
                                                {item.categoryName}
                                            </div>
                                        )}
                                        
                                        {/* Variants / Sizes */}
                                        {item.variants && item.variants.length > 0 && (
                                            <>
                                                <div className="w-1 h-1 rounded-full bg-[#DCCCBD]"></div>
                                                {item.variants.map(v => (
                                                    <div key={v.id} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded text-[#6E5C53]">
                                                        <span className="font-semibold text-[#3B3131]">{v.name}:</span> 
                                                        <span className="text-[#8B5A2B] font-medium">{formatPrice(v.price)}</span>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="flex flex-col md:flex-row items-center justify-between mt-10 pt-6 border-t border-[#F0EAE1] gap-4">
                            <div className="text-sm text-[#6E5C53] font-sans">
                                Đang xem <span className="font-bold text-[#3B3131]">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> - <span className="font-bold text-[#3B3131]">{Math.min(currentPage * itemsPerPage, totalItems)}</span> của <span className="font-bold text-[#3B3131]">{totalItems}</span> món
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#EFE6DD] text-[#6E5C53] hover:bg-[#FAF5F0] disabled:opacity-50 transition-all"
                                >
                                    <FiChevronLeft className="w-5 h-5" />
                                </button>
                                
                                {renderPaginationButtons()}
                                
                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#EFE6DD] text-[#6E5C53] hover:bg-[#FAF5F0] disabled:opacity-50 transition-all"
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
};

export default CafeMenu;
