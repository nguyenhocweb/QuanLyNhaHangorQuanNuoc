"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePagination } from "@/src/core/hooks/usePagination";
import useDebounce from "@/src/core/hooks/useDebounce";
import { cities } from "@/src/core/lib/configAddressCity";
import { useCategoryRestaurant } from "@/src/features/system_admin/categories/hook/useCategoryRestaurant_hook";
import { 
    FaSearch, 
    FaFilter, 
    FaCheck, 
    FaTimes, 
    FaMapMarkerAlt, 
    FaStar, 
    FaUtensils, 
    FaFire, 
    FaGem, 
    FaShieldAlt 
} from "react-icons/fa";
import { BiChevronDown } from "react-icons/bi";

const ratings = [
    { label: "Mọi đánh giá", value: "" },
    { label: "⭐ Từ 4.5 sao trở lên", value: "4.5" },
    { label: "⭐ Từ 4.0 sao trở lên", value: "4.0" },
    { label: "⭐ Từ 3.0 sao trở lên", value: "3.0" },
];

const quickTags = [
    { id: "new", label: "🔥 Mới ra mắt", icon: null },
    { id: "rating_high", label: "⭐ Trên 4.5 sao", value: "4.5" },
    { id: "vip", label: "🍷 Không gian VIP", icon: null },
    { id: "deposit", label: "🛡️ Đặt trước giữ bàn", icon: null },
];

export default function RestaurantFilterBar() {
    const { 
        setSearch, 
        applyFiltersRestaurant, 
        clean, 
        city: queryCity, 
        review: queryReview, 
        searchKeyword: querySearch,
        categoryRestaurant: queryCategories
    } = usePagination();

    const { data: categoryData } = useCategoryRestaurant({ page: 1, limit: 100, search: "", status: "true" });
    const restaurantCategories = categoryData?.data || [];

    const [searchTerm, setSearchTerm] = useState(querySearch || "");
    const [selectedCity, setSelectedCity] = useState(queryCity || "");
    const [selectedReview, setSelectedReview] = useState<string>(queryReview !== undefined ? String(queryReview) : "");
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        Array.isArray(queryCategories) ? queryCategories : queryCategories ? [queryCategories] : []
    );
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeQuickTag, setActiveQuickTag] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounce tìm kiếm
    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
    useEffect(() => {
        if (debouncedSearchTerm !== undefined) {
            if (debouncedSearchTerm) {
                setSearch(debouncedSearchTerm);
            } else if (querySearch) {
                clean("search");
            }
        }
    }, [debouncedSearchTerm]);

    const toggleCategory = (catId: string) => {
        const updated = selectedCategories.includes(catId)
            ? selectedCategories.filter(id => id !== catId)
            : [...selectedCategories, catId];
        setSelectedCategories(updated);
        applyFiltersRestaurant({
            city: selectedCity,
            review: selectedReview ? String(selectedReview) : undefined,
            categories: updated
        });
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedCity(val);
        applyFiltersRestaurant({
            city: val,
            review: selectedReview ? String(selectedReview) : undefined,
            categories: selectedCategories
        });
    };

    const handleReviewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedReview(val);
        applyFiltersRestaurant({
            city: selectedCity,
            review: val,
            categories: selectedCategories
        });
    };

    const handleQuickTagClick = (tag: typeof quickTags[0]) => {
        if (activeQuickTag === tag.id) {
            setActiveQuickTag(null);
            if (tag.value) {
                setSelectedReview("");
                applyFiltersRestaurant({
                    city: selectedCity,
                    review: "",
                    categories: selectedCategories
                });
            }
        } else {
            setActiveQuickTag(tag.id);
            if (tag.value) {
                setSelectedReview(tag.value);
                applyFiltersRestaurant({
                    city: selectedCity,
                    review: tag.value,
                    categories: selectedCategories
                });
            }
        }
    };

    const handleClearAll = () => {
        setSearchTerm("");
        setSelectedCity("");
        setSelectedReview("");
        setSelectedCategories([]);
        setActiveQuickTag(null);
        clean("all");
    };

    const hasActiveFilters = Boolean(
        searchTerm || selectedCity || selectedReview || selectedCategories.length > 0 || activeQuickTag
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full backdrop-blur-3xl bg-white/80 border border-white/80 shadow-[0_16px_40px_rgba(16,185,129,0.08)] rounded-3xl p-6 sm:p-7 transition-all duration-300 relative z-20 flex flex-col gap-5">
                
                {/* --- HÀNG 1: TÌM KIẾM & BỘ LỌC CHÍNH --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Ô Tìm kiếm Từ khóa */}
                    <div className="md:col-span-5 relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm tên nhà hàng, địa chỉ, thương hiệu..."
                            className="w-full pl-11 pr-10 py-3.5 bg-gray-50/90 hover:bg-white focus:bg-white border border-gray-200/80 focus:border-emerald-500 rounded-2xl text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 outline-none shadow-inner/30 font-medium"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            >
                                <FaTimes className="text-xs" />
                            </button>
                        )}
                    </div>

                    {/* Bộ lọc Thành phố */}
                    <div className="md:col-span-3 relative">
                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 text-sm pointer-events-none" />
                        <select
                            value={selectedCity}
                            onChange={handleCityChange}
                            className="w-full pl-10 pr-8 py-3.5 bg-gray-50/90 hover:bg-white focus:bg-white border border-gray-200/80 focus:border-emerald-500 rounded-2xl text-sm text-gray-800 font-medium transition-all duration-200 outline-none appearance-none cursor-pointer"
                        >
                            {cities.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                        <BiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none" />
                    </div>

                    {/* Dropdown Thể loại Ẩm thực */}
                    <div className="md:col-span-2 relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setShowDropdown(prev => !prev)}
                            className={`w-full px-4 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-between border transition-all duration-200 ${
                                selectedCategories.length > 0
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm"
                                    : "bg-gray-50/90 hover:bg-white text-gray-700 border-gray-200/80"
                            }`}
                        >
                            <span className="flex items-center gap-2 truncate">
                                <FaUtensils className={selectedCategories.length > 0 ? "text-emerald-600" : "text-gray-400"} />
                                <span className="truncate">
                                    {selectedCategories.length > 0
                                        ? `Ẩm thực (${selectedCategories.length})`
                                        : "Thể loại"}
                                </span>
                            </span>
                            <BiChevronDown className={`text-xl transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
                        </button>

                        {/* Danh sách Dropdown Checkbox */}
                        {showDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl p-2.5 z-50 max-h-72 overflow-y-auto space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 border-b border-gray-100">
                                    Chọn loại ẩm thực
                                </div>
                                {restaurantCategories.map((cat) => {
                                    const active = selectedCategories.includes(cat.id);
                                    return (
                                        <div
                                            key={cat.id}
                                            onClick={() => toggleCategory(cat.id)}
                                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                                                active
                                                    ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                                                    : "hover:bg-gray-50 text-gray-700 font-medium border border-transparent"
                                            }`}
                                        >
                                            <span className="text-xs truncate">{cat.name}</span>
                                            <div
                                                className={`w-4 h-4 flex items-center justify-center rounded border transition-colors ${
                                                    active
                                                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                                        : "border-gray-300 bg-white"
                                                }`}
                                            >
                                                {active && <FaCheck size={10} />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Bộ lọc Số sao đánh giá */}
                    <div className="md:col-span-2 relative">
                        <FaStar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 text-sm pointer-events-none" />
                        <select
                            value={selectedReview}
                            onChange={handleReviewChange}
                            className="w-full pl-9 pr-7 py-3.5 bg-gray-50/90 hover:bg-white focus:bg-white border border-gray-200/80 focus:border-emerald-500 rounded-2xl text-xs sm:text-sm text-gray-800 font-bold transition-all duration-200 outline-none appearance-none cursor-pointer truncate"
                        >
                            {ratings.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                        <BiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none" />
                    </div>
                </div>

                {/* --- HÀNG 2: THẺ LỌC NHANH (QUICK FILTER TAGS) & XÓA BỘ LỌC --- */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100/80">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 mr-1 flex items-center gap-1.5">
                            <FaFilter className="text-emerald-500 text-xs" /> Lọc nhanh:
                        </span>
                        {quickTags.map((tag) => {
                            const isActive = activeQuickTag === tag.id;
                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleQuickTagClick(tag)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
                                        isActive
                                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 scale-105"
                                            : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900 border border-gray-200/50"
                                    }`}
                                >
                                    <span>{tag.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Nút Xóa toàn bộ bộ lọc */}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="px-4 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 flex items-center gap-1.5 transition-all duration-200 shadow-sm ml-auto animate-in fade-in duration-200"
                        >
                            <FaTimes className="text-[10px]" />
                            <span>Xóa lọc ({selectedCategories.length + (searchTerm ? 1 : 0) + (selectedCity ? 1 : 0) + (selectedReview ? 1 : 0)})</span>
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}