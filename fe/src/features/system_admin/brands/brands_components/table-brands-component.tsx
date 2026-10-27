"use client";

import React, { useState, useMemo } from "react";
import { useGetBrands } from "../brands_hook/useGetBrands_hook";
import { 
    FiSearch, 
    FiMoreVertical, 
    FiMapPin, 
    FiMail, 
    FiPhone, 
    FiEye, 
    FiUser, 
    FiEdit2, 
    FiTrash2, 
    FiActivity, 
    FiClock, 
    FiX, 
    FiChevronLeft, 
    FiChevronRight, 
    FiGlobe, 
    FiCalendar, 
    FiRefreshCw, 
    FiShield 
} from "react-icons/fi";
import { MdOutlineStorefront, MdOutlineBusiness } from "react-icons/md";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import useDebounce from "@/src/core/hooks/useDebounce";
import IsActiveBrand_component from "./IsActiveBrand_component";
import { Brand } from "../brands_type/brand-type";
import FadeIn from "@/src/core/components/animation/FadeIn";
import UpdateBrand_modal from "./UpdateBrand_modal";
import DeleteBrand_modal from "./DeleteBrand_modal";

interface ActionMenuProps {
    brand: Brand;
    onEdit: () => void;
    onDelete: () => void;
    onChangeStatus: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onDelete, onChangeStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 220)}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 cursor-pointer"
                title="Tùy chọn"
            >
                <FiMoreVertical className="text-lg" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 text-left animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                        Thao tác
                    </div>
                    <button 
                        onClick={onChangeStatus}
                        className="w-full px-3.5 py-2 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-blue-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                        <FiActivity className="text-blue-500 w-4 h-4 shrink-0" /> 
                        <span>Cập nhật trạng thái</span>
                    </button>
                    <button 
                        onClick={onEdit}
                        className="w-full px-3.5 py-2 text-sm text-slate-700 hover:bg-amber-50/70 hover:text-amber-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                        <FiEdit2 className="text-amber-500 w-4 h-4 shrink-0" /> 
                        <span>Chỉnh sửa thông tin</span>
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button 
                        onClick={onDelete}
                        className="w-full px-3.5 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                        <FiTrash2 className="w-4 h-4 shrink-0" /> 
                        <span>Xóa thương hiệu</span>
                    </button>
                </div>
            )}
        </div>
    );
};

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
    ACTIVE: { 
        label: "Hoạt động", 
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/70", 
        dot: "bg-emerald-500 animate-pulse" 
    },
    PENDING: { 
        label: "Chờ duyệt", 
        badge: "bg-amber-50 text-amber-700 border-amber-200/70", 
        dot: "bg-amber-500" 
    },
    INACTIVE: { 
        label: "Tạm ngưng", 
        badge: "bg-slate-100 text-slate-700 border-slate-200/70", 
        dot: "bg-slate-400" 
    },
    TERMINATED: { 
        label: "Chấm dứt", 
        badge: "bg-rose-50 text-rose-700 border-rose-200/70", 
        dot: "bg-rose-500" 
    },
};

const TableBrandsComponent: React.FC = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce({ value: searchTerm, delay: 400 });

    const [statusFilter, setStatusFilter] = useState("all");
    const [featuredFilter, setFeaturedFilter] = useState("all");
    const [newFilter, setNewFilter] = useState("all");

    const { data, isLoading } = useGetBrands(
        page, 
        limit, 
        debouncedSearch as string, 
        statusFilter, 
        featuredFilter, 
        newFilter
    );

    const brands = useMemo(() => data?.data || [], [data?.data]);
    const total = data?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Calculate quick stats from loaded brands
    const activeCount = useMemo(() => brands.filter(b => b.isActive === "ACTIVE").length, [brands]);
    const pendingCount = useMemo(() => brands.filter(b => b.isActive === "PENDING").length, [brands]);
    const featuredCount = useMemo(() => brands.filter(b => b.isFeatured).length, [brands]);
    const totalRestaurantsOnPage = useMemo(() => 
        brands.reduce((sum, b) => sum + (b.restaurantCount || b.restaurants?.length || 0), 0), 
        [brands]
    );

    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [updatingBrand, setUpdatingBrand] = useState<Brand | null>(null);
    const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);

    const openStatusModal = (brand: Brand) => {
        setSelectedBrand(brand);
        setStatusModalOpen(true);
    };

    const hasActiveFilters = Boolean(
        searchTerm || 
        statusFilter !== "all" || 
        featuredFilter !== "all" || 
        newFilter !== "all"
    );

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setFeaturedFilter("all");
        setNewFilter("all");
        setPage(1);
    };

    return (
        <FadeIn className="w-full flex flex-col gap-6">
            {/* 1. Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/15 flex-shrink-0 mt-0.5">
                        <MdOutlineBusiness className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                            Quản lý Thương hiệu
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Quản lý toàn diện hệ thống đối tác nhượng quyền, chuỗi nhà hàng và trạng thái kiểm duyệt
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="px-3.5 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                            <FiRefreshCw className="w-3.5 h-3.5 text-slate-500" />
                            <span>Đặt lại bộ lọc</span>
                        </button>
                    )}
                    <div className="px-3.5 py-2 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        <span>Tổng {total} thương hiệu</span>
                    </div>
                </div>
            </div>

            {/* 2. Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full">
                {/* Total Brands */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-500">Tổng Thương hiệu</span>
                        <span className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{total}</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">Toàn hệ thống F&B</span>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <MdOutlineBusiness className="w-6 h-6" />
                    </div>
                </div>

                {/* Active Brands */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-500">Đang hoạt động</span>
                        <span className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
                            {activeCount}
                            <span className="text-xs font-normal text-slate-400 ml-1">/{brands.length}</span>
                        </span>
                        <span className="text-[11px] text-emerald-600/90 mt-0.5 font-medium">Vận hành bình thường</span>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <FaCheckCircle className="w-5 h-5" />
                    </div>
                </div>

                {/* Pending Brands */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-500">Chờ phê duyệt</span>
                        <span className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">{pendingCount}</span>
                        <span className="text-[11px] text-amber-600/90 mt-0.5 font-medium">Cần kiểm duyệt</span>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <FiClock className="w-5 h-5" />
                    </div>
                </div>

                {/* Featured / Restaurants */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-500">Tiêu biểu & Nhà hàng</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl sm:text-3xl font-bold text-indigo-600">{featuredCount}</span>
                            <span className="text-xs text-slate-500 font-medium">⭐ / {totalRestaurantsOnPage} chi nhánh</span>
                        </div>
                        <span className="text-[11px] text-indigo-600/90 mt-0.5 font-medium">Chuỗi đối tác lớn</span>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <MdOutlineStorefront className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* 3. Main Card: Toolbar + Table */}
            <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden flex flex-col">
                {/* Search & Filter Toolbar */}
                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col gap-4 bg-slate-50/40">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
                        {/* Search Input */}
                        <div className="relative flex-1 min-w-[260px]">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <FiSearch className="text-slate-400 text-base" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm theo tên thương hiệu, mã số thuế, email, người đại diện..."
                                className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPage(1); 
                                }}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => { setSearchTerm(""); setPage(1); }}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                    title="Xóa tìm kiếm"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        
                        {/* Filter Dropdowns */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {/* Status Filter */}
                            <div className="relative">
                                <select 
                                    className="w-full appearance-none bg-white border border-slate-200/90 rounded-xl pl-3.5 pr-8 py-2.5 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="ACTIVE">🟢 Đang hoạt động</option>
                                    <option value="PENDING">🟡 Chờ phê duyệt</option>
                                    <option value="INACTIVE">⚪ Tạm ngưng</option>
                                    <option value="TERMINATED">🔴 Chấm dứt</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Featured Filter */}
                            <div className="relative">
                                <select 
                                    className="w-full appearance-none bg-white border border-slate-200/90 rounded-xl pl-3.5 pr-8 py-2.5 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm cursor-pointer"
                                    value={featuredFilter}
                                    onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1); }}
                                >
                                    <option value="all">Tất cả Tiêu biểu</option>
                                    <option value="true">⭐ Là Tiêu biểu</option>
                                    <option value="false">Không tiêu biểu</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>

                            {/* New Filter */}
                            <div className="relative">
                                <select 
                                    className="w-full appearance-none bg-white border border-slate-200/90 rounded-xl pl-3.5 pr-8 py-2.5 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm cursor-pointer"
                                    value={newFilter}
                                    onChange={(e) => { setNewFilter(e.target.value); setPage(1); }}
                                >
                                    <option value="all">Tất cả Thời gian</option>
                                    <option value="true">✨ Thương hiệu Mới</option>
                                    <option value="false">Đã gia nhập</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Desktop Table (md and up) */}
                <div className="hidden md:block overflow-x-auto custom-scrollbar min-h-[380px]">
                    <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                        <thead className="text-xs uppercase bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100 tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Thương hiệu</th>
                                <th className="px-6 py-4">Pháp lý & Liên hệ</th>
                                <th className="px-6 py-4">Quy mô & Địa bàn</th>
                                <th className="px-6 py-4">Ngày tham gia</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse bg-white">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl shrink-0" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-slate-100 rounded w-36" />
                                                    <div className="h-3 bg-slate-100 rounded w-24" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-2">
                                                <div className="h-3.5 bg-slate-100 rounded w-28" />
                                                <div className="h-3 bg-slate-100 rounded w-36" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-2">
                                                <div className="h-4 bg-slate-100 rounded w-20" />
                                                <div className="h-3 bg-slate-100 rounded w-28" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="h-3.5 bg-slate-100 rounded w-24" />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="h-6 bg-slate-100 rounded-full w-24" />
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="h-8 bg-slate-100 rounded-xl w-16 mx-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : brands.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-500 bg-white">
                                        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-3.5 text-slate-300">
                                                <MdOutlineStorefront className="text-3xl" />
                                            </div>
                                            <p className="text-base font-bold text-slate-800 mb-1">
                                                Không tìm thấy thương hiệu
                                            </p>
                                            <p className="text-xs sm:text-sm text-slate-500 mb-4">
                                                Chưa có dữ liệu hoặc không có kết quả phù hợp với các điều kiện lọc hiện tại.
                                            </p>
                                            {hasActiveFilters && (
                                                <button
                                                    onClick={resetFilters}
                                                    className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                                                >
                                                    Xóa bộ lọc tìm kiếm
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                brands.map((brand: Brand) => {
                                    const statusInfo = STATUS_CONFIG[brand.isActive || "PENDING"] || STATUS_CONFIG.PENDING;
                                    const joinDate = brand.createdAt 
                                        ? new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(brand.createdAt)) 
                                        : "N/A";
                                    
                                    const shortAddress = [brand.address?.district, brand.address?.province].filter(Boolean).join(", ") || "Chưa cập nhật";
                                    const fullAddress = [brand.address?.street, brand.address?.ward, brand.address?.district, brand.address?.province].filter(Boolean).join(", ") || "Chưa cập nhật";

                                    return (
                                        <tr key={brand.id} className="bg-white hover:bg-slate-50/80 transition-colors group">
                                            {/* Column 1: Brand Logo & Name */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3.5">
                                                    {brand.logo ? (
                                                        <img 
                                                            src={brand.logo} 
                                                            alt={brand.name} 
                                                            className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-slate-100 shrink-0 bg-white" 
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-sm shrink-0 text-lg">
                                                            {brand.name ? brand.name.charAt(0).toUpperCase() : "B"}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={`/system/brands/${brand.id}`}
                                                                className="font-bold text-slate-800 text-sm max-w-[220px] truncate hover:text-blue-600 transition-colors" 
                                                                title={brand.name}
                                                            >
                                                                {brand.name}
                                                            </Link>
                                                            {brand.isNew && (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">
                                                                    MỚI
                                                                </span>
                                                            )}
                                                            {brand.isFeatured && (
                                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200" title="Thương hiệu tiêu biểu">
                                                                    <FaStar className="w-2.5 h-2.5 text-amber-500" />
                                                                    <span>VIP</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                        {brand.link ? (
                                                            <a 
                                                                href={brand.link.startsWith("http") ? brand.link : `https://${brand.link}`} 
                                                                target="_blank" 
                                                                rel="noreferrer" 
                                                                className="text-xs text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1 mt-0.5 w-max font-medium"
                                                            >
                                                                <FiGlobe className="text-[11px]" />
                                                                <span className="max-w-[180px] truncate">{brand.link.replace(/^https?:\/\//, "")}</span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-[11px] text-slate-400 mt-0.5">Chưa có Website</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            {/* Column 2: Legal & Contact */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                                        <FiShield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="text-slate-400">MST:</span>
                                                        <span>{brand.taxCode || <span className="text-slate-400 italic font-normal">Trống</span>}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-500">
                                                        <FiMail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="truncate max-w-[160px]" title={brand.emailContact}>
                                                            {brand.emailContact || "---"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-500">
                                                        <FiPhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span>{brand.phoneContact || "---"}</span>
                                                    </div>
                                                    {brand.employments && brand.employments.length > 0 && (
                                                        <div className="flex items-center gap-1.5 text-slate-600 pt-1 mt-0.5 border-t border-slate-100">
                                                            <FiUser className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                            <span className="truncate max-w-[150px] font-medium" title={brand.employments.map(e => e.user.name).join(", ")}>
                                                                {brand.employments[0]?.user?.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Column 3: Scope & Location */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 text-slate-700 border border-slate-100 w-max">
                                                        <MdOutlineStorefront className="text-base text-blue-600" />
                                                        <span className="font-bold text-slate-900">
                                                            {brand.restaurantCount || brand.restaurants?.length || 0}
                                                        </span>
                                                        <span className="text-xs text-slate-500">nhà hàng</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500" title={fullAddress}>
                                                        <FiMapPin className="text-slate-400 shrink-0 text-xs" />
                                                        <span className="truncate max-w-[160px]">{shortAddress}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            {/* Column 4: Join Date */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-1.5 text-slate-700 font-medium text-xs">
                                                        <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{joinDate}</span>
                                                    </div>
                                                    <span className="text-[11px] text-slate-400 pl-5">Gia nhập</span>
                                                </div>
                                            </td>
                                            
                                            {/* Column 5: Status */}
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusInfo.badge} shadow-xs`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                                                    <span>{statusInfo.label}</span>
                                                </div>
                                            </td>
                                            
                                            {/* Column 6: Actions */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Link 
                                                        href={`/system/brands/${brand.id}`}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                        title="Xem chi tiết hồ sơ"
                                                    >
                                                        <FiEye className="text-lg" />
                                                    </Link>
                                                    <ActionMenu 
                                                        brand={brand} 
                                                        onEdit={() => setUpdatingBrand(brand)}
                                                        onDelete={() => setDeletingBrand(brand)}
                                                        onChangeStatus={() => openStatusModal(brand)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 5. Mobile Card View (< md) */}
                <div className="block md:hidden divide-y divide-slate-100">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="p-4 space-y-3 animate-pulse bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-100 rounded w-32" />
                                        <div className="h-3 bg-slate-100 rounded w-20" />
                                    </div>
                                </div>
                                <div className="h-8 bg-slate-100 rounded-xl" />
                            </div>
                        ))
                    ) : brands.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            <MdOutlineStorefront className="text-4xl text-slate-300 mx-auto mb-2" />
                            <p className="font-semibold text-slate-700 text-sm">Không tìm thấy thương hiệu</p>
                        </div>
                    ) : (
                        brands.map((brand: Brand) => {
                            const statusInfo = STATUS_CONFIG[brand.isActive || "PENDING"] || STATUS_CONFIG.PENDING;
                            const shortAddress = [brand.address?.district, brand.address?.province].filter(Boolean).join(", ") || "Chưa cập nhật";
                            
                            return (
                                <div key={brand.id} className="p-4 flex flex-col gap-3.5 bg-white hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {brand.logo ? (
                                                <img 
                                                    src={brand.logo} 
                                                    alt={brand.name} 
                                                    className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0" 
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                                                    {brand.name ? brand.name.charAt(0).toUpperCase() : "B"}
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <Link 
                                                        href={`/system/brands/${brand.id}`}
                                                        className="font-bold text-slate-900 text-sm hover:text-blue-600"
                                                    >
                                                        {brand.name}
                                                    </Link>
                                                    {brand.isFeatured && (
                                                        <span className="text-amber-500 text-xs">⭐</span>
                                                    )}
                                                    {brand.isNew && (
                                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">
                                                            MỚI
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-0.5">
                                                    MST: {brand.taxCode || "---"}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <ActionMenu 
                                            brand={brand} 
                                            onEdit={() => setUpdatingBrand(brand)}
                                            onDelete={() => setDeletingBrand(brand)}
                                            onChangeStatus={() => openStatusModal(brand)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-1.5">
                                            <MdOutlineStorefront className="text-blue-600 w-4 h-4 shrink-0" />
                                            <span className="font-semibold text-slate-800">{brand.restaurantCount || brand.restaurants?.length || 0}</span>
                                            <span>nhà hàng</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 truncate">
                                            <FiMapPin className="text-slate-400 shrink-0" />
                                            <span className="truncate">{shortAddress}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 col-span-2 truncate">
                                            <FiMail className="text-slate-400 shrink-0" />
                                            <span className="truncate">{brand.emailContact || brand.phoneContact || "Chưa có liên hệ"}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                                            <span>{statusInfo.label}</span>
                                        </div>
                                        <Link 
                                            href={`/system/brands/${brand.id}`}
                                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            <span>Xem chi tiết</span>
                                            <FiEye className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* 6. Pagination Bar (AGENTS.md Rule 6 compliant) */}
                {!isLoading && total > 0 && (
                    <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/40">
                        {/* Info text */}
                        <span className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
                            Hiển thị <span className="font-bold text-slate-800">{Math.min((page - 1) * limit + 1, total)}</span> đến{" "}
                            <span className="font-bold text-slate-800">{Math.min(page * limit, total)}</span> của{" "}
                            <span className="font-bold text-slate-800">{total}</span> thương hiệu
                            <span className="text-slate-400 ml-1.5">(Trang {page}/{totalPages})</span>
                        </span>

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                            {/* Rows per page selector */}
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="hidden sm:inline">Số dòng:</span>
                                <select
                                    value={limit}
                                    onChange={(e) => {
                                        setLimit(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
                                >
                                    <option value={10}>10 / trang</option>
                                    <option value={20}>20 / trang</option>
                                    <option value={50}>50 / trang</option>
                                </select>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-1.5">
                                <button 
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                                >
                                    <FiChevronLeft className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Trước</span>
                                </button>
                                
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum: number;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (page <= 3) {
                                            pageNum = i + 1;
                                        } else if (page >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = page - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                                    page === pageNum
                                                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button 
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                                >
                                    <span className="hidden sm:inline">Sau</span>
                                    <FiChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {isStatusModalOpen && selectedBrand && (
                <IsActiveBrand_component 
                    id={selectedBrand.id}
                    name={selectedBrand.name}
                    logo={selectedBrand.logo || ""}
                    isActive={selectedBrand.isActive || "PENDING"} 
                    onclickCloseActive={() => setStatusModalOpen(false)}
                />
            )}
            
            {updatingBrand && (
                <UpdateBrand_modal 
                    brand={updatingBrand} 
                    onClose={() => setUpdatingBrand(null)} 
                />
            )}
            
            {deletingBrand && (
                <DeleteBrand_modal 
                    brand={deletingBrand} 
                    onClose={() => setDeletingBrand(null)} 
                />
            )}
        </FadeIn>
    );
};

export default TableBrandsComponent;
