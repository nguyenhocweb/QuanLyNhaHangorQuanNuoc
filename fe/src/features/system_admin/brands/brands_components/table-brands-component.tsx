"use client"
import React, { useState } from "react";
import { useGetBrands } from "../brands_hook/useGetBrands_hook";
import { FiSearch, FiMoreVertical, FiMapPin, FiLink, FiMail, FiPhone, FiEye, FiUser } from "react-icons/fi";
import Link from "next/link";
import { MdOutlineStorefront } from "react-icons/md";
import useDebounce from "@/src/core/hooks/useDebounce";
import IsActiveBrand_component from "./IsActiveBrand_component";
import { Brand } from "../brands_type/brand-type";
import FadeIn from "@/src/core/components/animation/FadeIn";
import UpdateBrand_modal from "./UpdateBrand_modal";
import DeleteBrand_modal from "./DeleteBrand_modal";
import { FiEdit2, FiTrash2, FiActivity } from "react-icons/fi";

const ActionMenu = ({ brand, onEdit, onDelete, onChangeStatus }: { brand: Brand, onEdit: () => void, onDelete: () => void, onChangeStatus: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
                <FiMoreVertical className="text-lg" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10 text-left">
                    <button 
                        onClick={onChangeStatus}
                        className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                        <FiActivity className="text-blue-500" /> Cập nhật trạng thái
                    </button>
                    <button 
                        onClick={onEdit}
                        className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                        <FiEdit2 className="text-amber-500" /> Chỉnh sửa thông tin
                    </button>
                    <button 
                        onClick={onDelete}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100 mt-1 pt-2"
                    >
                        <FiTrash2 /> Xóa thương hiệu
                    </button>
                </div>
            )}
        </div>
    );
};

const STATUS_BADGE: Record<string, { label: string, color: string }> = {
    "ACTIVE": { label: "Hoạt động", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    "PENDING": { label: "Chờ duyệt", color: "bg-amber-100 text-amber-700 border-amber-200" },
    "INACTIVE": { label: "Tạm ngưng", color: "bg-slate-100 text-slate-700 border-slate-200" },
    "TERMINATED": { label: "Chấm dứt", color: "bg-red-100 text-red-700 border-red-200" },
};

const TableBrandsComponent = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce({ value: searchTerm, delay: 600 });
    const limit = 10;

    const { data, isLoading } = useGetBrands(page, limit, debouncedSearch as string);
    const brands = data?.data || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [updatingBrand, setUpdatingBrand] = useState<Brand | null>(null);
    const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);

    const openStatusModal = (brand: Brand) => {
        setSelectedBrand(brand);
        setStatusModalOpen(true);
    };

    return (
        <FadeIn className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col">
            {/* Header Area */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Danh sách Thương hiệu</h3>
                    <p className="text-sm text-slate-500 mt-1">Quản lý toàn diện hệ thống đối tác nhượng quyền & chuỗi nhà hàng</p>
                </div>
                
                <div className="relative w-full sm:w-80">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="text-slate-400 text-lg" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm thương hiệu, MST, email..."
                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); 
                        }}
                    />
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
                <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                    <thead className="text-xs uppercase bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 tracking-wider">
                        <tr>
                            <th className="px-6 py-5">Thương hiệu</th>
                            <th className="px-6 py-5">Pháp lý & Liên hệ</th>
                            <th className="px-6 py-5">Quy mô & Địa bàn</th>
                            <th className="px-6 py-5">Ngày tham gia</th>
                            <th className="px-6 py-5">Trạng thái</th>
                            <th className="px-6 py-5 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <tr key={idx} className="animate-pulse bg-white">
                                    <td className="px-6 py-5"><div className="flex gap-4"><div className="w-14 h-14 bg-slate-200 rounded-2xl"></div><div className="flex-1 space-y-2 py-1"><div className="h-4 bg-slate-200 rounded w-3/4"></div><div className="h-3 bg-slate-200 rounded w-1/2"></div></div></div></td>
                                    <td className="px-6 py-5"><div className="space-y-2"><div className="h-4 bg-slate-200 rounded w-full"></div><div className="h-3 bg-slate-200 rounded w-2/3"></div></div></td>
                                    <td className="px-6 py-5"><div className="space-y-2"><div className="h-4 bg-slate-200 rounded w-24"></div><div className="h-3 bg-slate-200 rounded w-32"></div></div></td>
                                    <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                                    <td className="px-6 py-5"><div className="h-6 bg-slate-200 rounded-full w-24"></div></td>
                                    <td className="px-6 py-5"><div className="h-8 bg-slate-200 rounded-lg w-20 mx-auto"></div></td>
                                </tr>
                            ))
                        ) : brands.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-24 text-center text-slate-500 bg-white">
                                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                            <MdOutlineStorefront className="text-4xl text-slate-300" />
                                        </div>
                                        <p className="text-lg font-semibold text-slate-700 mb-1">Không có dữ liệu</p>
                                        <p className="text-sm text-slate-500">Chưa có thương hiệu nào hoặc không tìm thấy kết quả phù hợp với từ khóa tìm kiếm.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            brands.map((brand: Brand) => {
                                const statusInfo = STATUS_BADGE[brand.isActive || "PENDING"] || STATUS_BADGE["PENDING"];
                                const joinDate = brand.createdAt 
                                    ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(brand.createdAt)) 
                                    : "N/A";
                                
                                const fullAddress = [brand.address?.street, brand.address?.ward, brand.address?.district, brand.address?.province].filter(Boolean).join(', ') || "Chưa rõ khu vực";
                                const shortAddress = [brand.address?.district, brand.address?.province].filter(Boolean).join(', ') || "Chưa rõ khu vực";
                                
                                return (
                                    <tr key={brand.id} className="bg-white hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                {brand.logo ? (
                                                    <img src={brand.logo} alt={brand.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-100 shrink-0 bg-white" />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 font-bold flex items-center justify-center shadow-sm border border-blue-100 shrink-0 text-xl">
                                                        {brand.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-slate-800 text-base max-w-[200px] truncate" title={brand.name}>{brand.name}</h4>
                                                        {brand.isNew && (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-600 border border-blue-200">MỚI</span>
                                                        )}
                                                        {brand.isFeatured && (
                                                            <span className="text-amber-400 text-sm" title="Thương hiệu tiêu biểu">⭐</span>
                                                        )}
                                                    </div>
                                                    {brand.link ? (
                                                        <a href={brand.link.startsWith('http') ? brand.link : `https://${brand.link}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1 w-max">
                                                            <FiLink className="text-[10px]" /> {brand.link.replace(/^https?:\/\//, '')}
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 mt-1">Chưa cập nhật Website</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                                    <span className="text-xs text-slate-400 w-8">MST:</span>
                                                    {brand.tax_code || <span className="text-slate-400 font-normal italic">Trống</span>}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <FiMail className="text-slate-400" />
                                                    <span className="truncate max-w-[150px]" title={brand.email_contact}>{brand.email_contact || "---"}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <FiPhone className="text-slate-400" />
                                                    <span>{brand.phone_contact || "---"}</span>
                                                </div>
                                                {brand.employments && brand.employments.length > 0 && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 pt-1.5 border-t border-slate-100">
                                                        <FiUser className="text-slate-400 shrink-0" />
                                                        <span className="truncate max-w-[150px] font-medium text-slate-600" title={brand.employments.map(e => e.user.name).join(', ')}>
                                                            {brand.employments.map(e => e.user.name).join(', ')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-lg font-bold text-slate-800">{brand.restaurantCount || brand.restaurants?.length || 0}</span>
                                                    <span className="text-xs text-slate-500 font-medium">nhà hàng</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 w-max px-2 py-1 rounded-md border border-slate-100">
                                                    <FiMapPin className="text-slate-400 shrink-0" />
                                                    <span className="truncate max-w-[150px]" title={fullAddress}>{shortAddress}</span>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-slate-700">{joinDate}</span>
                                                <span className="text-xs text-slate-400">Tham gia hệ thống</span>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${statusInfo.color} shadow-sm`}>
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Link 
                                                    href={`/system/brands/${brand.id}`}
                                                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center group"
                                                    title="Xem chi tiết"
                                                >
                                                    <FiEye className="text-lg group-hover:scale-110 transition-transform" />
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

            {/* Pagination */}
            {!isLoading && brands.length > 0 && (
                <div className="px-6 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <span className="text-sm text-slate-500">
                        Hiển thị <span className="font-bold text-slate-700">{brands.length}</span> trên tổng <span className="font-bold text-slate-700">{total}</span>
                    </span>
                    <div className="flex gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            Trang trước
                        </button>
                        <div className="flex items-center justify-center px-4 py-2 text-sm font-bold text-blue-700 bg-blue-50 rounded-xl border border-blue-100 min-w-[3rem]">
                            {page} / {totalPages}
                        </div>
                        <button 
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            Trang sau
                        </button>
                    </div>
                </div>
            )}

            {isStatusModalOpen && selectedBrand && (
                <IsActiveBrand_component 
                    id={selectedBrand.id}
                    name={selectedBrand.name}
                    logo={selectedBrand.logo || ""}
                    isActive={selectedBrand.isActive || "PENDING"} 
                    onclickCloseActive={() => setStatusModalOpen(false)}
                />
            )}
            
            {updatingBrand && <UpdateBrand_modal brand={updatingBrand} onClose={() => setUpdatingBrand(null)} />}
            {deletingBrand && <DeleteBrand_modal brand={deletingBrand} onClose={() => setDeletingBrand(null)} />}
        </FadeIn>
    );
};

export default TableBrandsComponent;
