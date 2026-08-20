"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { GiSushis } from "react-icons/gi";
import { useGetPublicRestaurantMenu } from "@/src/features/public/restaurant/hook/useGetPublicRestaurantMenu";
import { useGetPublicMenuItems } from "@/src/features/public/restaurant/hook/useGetPublicMenuItems";
import { IPublicMenuCategory } from "@/src/features/public/restaurant/type/restaurant.public.type";
import useDebounce from "@/src/core/hooks/useDebounce";

interface Props {
    restaurantId: string;
}

const SushiMenu: React.FC<Props> = ({ restaurantId }) => {
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
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all border ${currentPage === page ? 'bg-[#D32F2F] text-white border-[#D32F2F] shadow-[0_0_10px_rgba(211,47,47,0.5)]' : 'bg-[#242424] text-[#A0A0A0] border-[#404040] hover:bg-[#333] hover:text-white'}`}
            >
                {page}
            </button>
        ));
    };

    return (
        <div className="space-y-10 bg-[#121212] p-6 sm:p-10 md:p-12 rounded-3xl border border-[#333] shadow-xl relative overflow-hidden">
            {/* Japanese Wave Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D4AF37\' fill-opacity=\'1\'%3E%3Cpath d=\'M30 30c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15-15-6.716-15-15zm-15 0c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15-15-6.716-15-15zm-15 0C0 21.716 6.716 15 15 15s15 6.716 15 15-6.716 15-15 15S0 38.284 0 30z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

            <div className="text-center mb-8 relative z-10">
                <h2 className="text-4xl font-serif text-white inline-flex items-center gap-3">
                    <GiSushis className="text-[#D32F2F]" /> 
                    Thực Đơn Omakase
                    <GiSushis className="text-[#D32F2F] scale-x-[-1]" />
                </h2>
                <p className="text-[#D4AF37] mt-4 font-serif italic text-lg tracking-wider">Hương vị nguyên bản, nghệ thuật thăng hoa</p>
            </div>

            {/* Thanh công cụ */}
            <div className="relative z-10 bg-[#1A1A1A] p-4 rounded-full border border-[#333] shadow-md flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <FiSearch className="text-[#D32F2F]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm Sushi, Sashimi..."
                        className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-[#707070]"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto px-4 md:px-0">
                    <div className="w-px h-8 bg-[#333] hidden md:block"></div>
                    <div className="relative w-full md:w-48">
                        <select
                            value={activeMenuId}
                            onChange={(e) => {
                                setActiveMenuId(e.target.value);
                                setActiveCategoryId("all");
                                setCurrentPage(1);
                            }}
                            className="w-full pl-4 pr-8 py-3 bg-transparent border-none appearance-none focus:outline-none focus:ring-0 text-white cursor-pointer"
                        >
                            <option value="all" className="bg-[#1A1A1A]">Tất cả thực đơn</option>
                            {menuData?.map(menu => (
                                <option key={menu.id} value={menu.id} className="bg-[#1A1A1A]">{menu.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-px h-8 bg-[#333] hidden md:block"></div>
                    <div className="relative w-full md:w-48">
                        <select
                            value={activeCategoryId}
                            onChange={(e) => {
                                setActiveCategoryId(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-4 pr-8 py-3 bg-transparent border-none appearance-none focus:outline-none focus:ring-0 text-white cursor-pointer"
                        >
                            <option value="all" className="bg-[#1A1A1A]">Tất cả danh mục</option>
                            {availableCategories.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-[#1A1A1A]">{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Danh sách món ăn */}
            <div className="relative z-10">
                {isLoading && paginatedItems.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex p-4 bg-[#1A1A1A] rounded-2xl border border-[#333] gap-6">
                                <div className="w-32 h-32 bg-[#242424] rounded-xl" />
                                <div className="flex-1 py-4">
                                    <div className="h-4 bg-[#242424] rounded w-3/4 mb-4" />
                                    <div className="h-3 bg-[#242424] rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : paginatedItems.length === 0 ? (
                    <div className="text-center py-20 bg-[#1A1A1A] rounded-3xl border border-[#333] border-dashed">
                        <p className="text-[#A0A0A0] font-sans">Không tìm thấy món ăn nào.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                            {paginatedItems.map(item => (
                                <div key={item.id} className="group flex flex-row bg-[#1A1A1A] p-3 sm:p-4 rounded-2xl border border-[#333] shadow-md hover:border-[#D32F2F] hover:shadow-[0_0_30px_rgba(211,47,47,0.15)] transition-all duration-500 gap-4 sm:gap-6 cursor-pointer overflow-hidden relative">
                                    {/* Accent line on hover */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D32F2F] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>

                                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-[#242424]">
                                        <Image
                                            src={item.image || "/placeholder.jpg"}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-110"
                                        />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full text-[#D4AF37] border border-[#D4AF37]/30">
                                            <GiSushis size={12} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center flex-1 py-1 pr-2">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                {item.categoryName && (
                                                    <span className="px-2 py-0.5 bg-[#242424] text-[#D4AF37] border border-[#404040] rounded text-[10px] sm:text-xs font-sans tracking-wide uppercase">{item.categoryName}</span>
                                                )}
                                            </div>
                                            <h4 className="font-serif font-bold text-white text-lg sm:text-xl line-clamp-1 group-hover:text-[#D32F2F] transition-colors">{item.name}</h4>
                                            <p className="text-xs sm:text-sm text-[#A0A0A0] line-clamp-2 mt-1 sm:mt-2 leading-relaxed">{item.description}</p>
                                        </div>
                                        <div className="flex flex-col mt-2 sm:mt-4">
                                            {item.variants && item.variants.length > 0 ? (
                                                <>
                                                    <div className="text-[10px] sm:text-xs text-[#A0A0A0] mb-1">Từ <span className="text-white font-bold text-base sm:text-lg">{formatPrice(Math.min(...item.variants.map(v => v.price)))}</span></div>
                                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                        {item.variants.map(v => (
                                                            <div key={v.id} className="px-2 py-0.5 bg-[#242424] rounded border border-[#404040] text-[10px] sm:text-xs text-[#EAEAEA]">
                                                                <span className="text-[#A0A0A0]">{v.name}:</span> <span className="text-white font-medium">{formatPrice(v.price)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="font-sans font-bold text-white text-base sm:text-lg">
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
                            <div className="flex flex-col md:flex-row items-center justify-between mt-8 p-4 sm:p-6 bg-[#1A1A1A] border border-[#333] rounded-2xl shadow-sm gap-4">
                                <div className="text-sm text-[#A0A0A0] font-sans text-center md:text-left">
                                    Hiển thị <span className="font-bold text-white">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> đến <span className="font-bold text-white">{Math.min(currentPage * itemsPerPage, totalItems)}</span> của <span className="font-bold text-white">{totalItems}</span> kết quả
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-4 justify-center">
                                    <div className="flex gap-2 items-center">
                                        <button 
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#404040] bg-[#242424] text-[#EAEAEA] hover:bg-[#333] hover:text-white disabled:opacity-30 transition-all"
                                        >
                                            <FiChevronLeft className="w-5 h-5" />
                                        </button>
                                        
                                        {renderPaginationButtons()}
                                        
                                        <button 
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#404040] bg-[#242424] text-[#EAEAEA] hover:bg-[#333] hover:text-white disabled:opacity-30 transition-all"
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
        </div>
    );
};

export default SushiMenu;
