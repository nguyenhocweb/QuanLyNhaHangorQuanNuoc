"use client";

import React, { useState, useEffect } from "react";
import { usePagination } from "@/src/core/hooks/usePagination";
import useDebounce from "@/src/core/hooks/useDebounce";
import { 
    FaSearch, 
    FaTimes, 
    FaMapMarkerAlt, 
    FaFilter, 
    FaRedo, 
    FaCrown, 
    FaFire, 
    FaGlobeAsia, 
    FaCheck 
} from "react-icons/fa";

const QUICK_FILTERS = [
    { key: "all", label: "✨ Tất Cả Thương Hiệu", desc: "Toàn bộ chuỗi đối tác" },
    { key: "vip", label: "👑 Đối Tác Chiến Lược", desc: "Giữ bàn 100%" },
    { key: "hot", label: "🔥 Chuỗi Hot Nhất", desc: "Được đặt nhiều nhất" },
];

const PROVINCES = [
    "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
    "Quảng Ninh", "Khánh Hòa", "Bình Dương", "Đồng Nai", "Bà Rịa - Vũng Tàu",
    "Thừa Thiên Huế", "Lâm Đồng", "Quảng Nam", "Bắc Ninh", "Thanh Hóa",
    "Nghệ An", "Hải Dương", "Vĩnh Phúc", "Hưng Yên", "Thái Nguyên",
    "An Giang", "Kiên Giang", "Bình Định", "Phú Yên", "Bình Thuận"
];

const BrandFilterBar: React.FC = () => {
    const { setSearch, setCity, clean, city, searchKeyword, brandFilter, setBrandFilter } = usePagination();
    const [searchTerm, setSearchTerm] = useState(searchKeyword || "");

    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 600 });

    useEffect(() => {
        if (debouncedSearchTerm !== undefined) {
            if (debouncedSearchTerm.trim() !== "") {
                setSearch(debouncedSearchTerm.trim());
            } else {
                clean("search");
            }
        }
    }, [debouncedSearchTerm]);

    const handleTabClick = (key: string) => {
        setBrandFilter(key);
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "all" || !value) {
            clean("city");
        } else {
            setCity(value);
        }
    };

    const handleResetAll = () => {
        setSearchTerm("");
        setBrandFilter("all");
        clean("search");
        clean("city");
    };

    const isFiltered = !!searchTerm || !!city || (brandFilter !== "all" && !!brandFilter);

    return (
        <section id="brand-filter-section" className="w-full relative z-20 -mt-8 sm:-mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
                <div className="w-full bg-white/80 backdrop-blur-3xl border border-white/80 shadow-[0_16px_40px_rgba(99,102,241,0.08)] rounded-3xl p-5 sm:p-7 flex flex-col gap-6 transition-all duration-300">
                    
                    {/* ==================== DÒNG 1: TABS NHÃN DANH MỤC NHANH ==================== */}
                    <div className="flex items-center justify-between gap-4 flex-wrap border-b border-gray-100 pb-5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mr-2">
                                <FaFilter className="text-purple-600" /> Phân loại:
                            </span>
                            {QUICK_FILTERS.map((tab) => {
                                const isActive = (brandFilter || "all") === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => handleTabClick(tab.key)}
                                        className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                                            isActive
                                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 scale-105"
                                                : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900"
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        {isActive && <FaCheck className="text-[10px]" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Nút Xóa bộ lọc */}
                        {isFiltered && (
                            <button
                                type="button"
                                onClick={handleResetAll}
                                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 border border-rose-200/60 shadow-sm animate-pulse"
                            >
                                <FaRedo className="text-[10px]" />
                                <span>Xóa bộ lọc ({[searchTerm && "Từ khóa", city && "Thành phố"].filter(Boolean).join(", ")})</span>
                            </button>
                        )}
                    </div>

                    {/* ==================== DÒNG 2: Ô TÌM KIẾM & CHỌN THÀNH PHỐ ==================== */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Ô Tìm Kiếm (8 cột trên Desktop) */}
                        <div className="md:col-span-7 lg:col-span-8 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <FaSearch className="text-sm text-purple-600" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm tên thương hiệu, ẩm thực lẩu nướng, sushi, buffet..."
                                className="w-full bg-gray-50/90 border border-gray-200/80 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all shadow-inner"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm("")}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Xóa từ khóa"
                                >
                                    <FaTimes className="text-sm" />
                                </button>
                            )}
                        </div>

                        {/* Dropdown Thành Phố (4 cột trên Desktop) */}
                        <div className="md:col-span-5 lg:col-span-4 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-rose-500">
                                <FaMapMarkerAlt className="text-sm" />
                            </div>
                            <select
                                value={city || "all"}
                                onChange={handleCityChange}
                                className="w-full bg-gray-50/90 border border-gray-200/80 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer"
                            >
                                <option value="all">📍 Tất cả tỉnh / thành phố</option>
                                {PROVINCES.map((prov, index) => (
                                    <option value={prov} key={index} className="font-semibold text-gray-800">
                                        📍 {prov}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 text-xs font-bold">
                                ▼
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandFilterBar;