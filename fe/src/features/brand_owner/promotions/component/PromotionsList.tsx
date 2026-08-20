"use client";

import React, { useState } from 'react';
import { Div, H, Button } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { useGetPromotions } from "../hook/useGetPromotions";
import { useDeletePromotion } from "../hook/useDeletePromotion";
import useDebounce from "@/src/core/hooks/useDebounce";
import { FiPlus, FiSearch, FiCalendar, FiClock, FiUsers, FiTag, FiTrendingUp, FiDollarSign } from "react-icons/fi";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
// import { PromotionCard } from './PromotionCard'; // Assuming we create this later, but for now inline

const PromotionsControlCenter = () => {
    const { user } = useAuthStore();
    const brandId = user?.brand?.[0]?.id || "";
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'EXPIRED'>('ALL');
    const debouncedSearch = useDebounce({ value: searchTerm, delay: 500 });

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { data, isLoading } = useGetPromotions(brandId, {
        page,
        limit: 12,
        search: debouncedSearch
    });

    const { mutate: deletePromotion, isPending: isDeleting } = useDeletePromotion();

    const handleDelete = () => {
        if (deletingId) {
            deletePromotion(
                { brandId, promotionId: deletingId },
                {
                    onSuccess: () => {
                        toast.success("Đã xóa chiến dịch khuyến mãi");
                        setDeletingId(null);
                    },
                    onError: () => {
                        toast.error("Có lỗi xảy ra khi xóa chiến dịch");
                    }
                }
            );
        }
    };

    const promotions = data?.items || [];
    const filteredPromotions = promotions.filter((p: any) => {
        const isActive = p.status === 'ACTIVE';
        if (activeTab === 'ACTIVE') return isActive;
        if (activeTab === 'EXPIRED') return !isActive;
        return true;
    });

    const totalActive = promotions.filter((p: any) => p.status === 'ACTIVE').length;
    const totalUsed = promotions.reduce((acc: number, p: any) => acc + (p.usedCount || 0), 0);

    return (
        <FadeIn className="w-full flex flex-col gap-8 p-6 pb-10">
            {/* Header & Metrics */}
            <Div vitri="col_none" className="w-full gap-6">
                <Div vitri="row_between" className="w-full">
                    <Div vitri="col_none" className="gap-1">
                        <H level={1} className="text-3xl font-bold text-slate-800 tracking-tight">Chiến Dịch Khuyến Mãi</H>
                        <p className="text-slate-500 font-medium">Trung tâm điều khiển và phân tích ngân sách cấp thương hiệu.</p>
                    </Div>
                    <Button 
                        onClick={() => router.push('/quan-ly-thuong-hieu/promotions/create')}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-1 font-semibold"
                    >
                        <FiPlus className="text-xl" /> Tạo Chiến Dịch Mới
                    </Button>
                </Div>

                {/* Dashboard Widgets (Glassmorphism & Soft UI) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <Div vitri="row_between" className="mb-4">
                            <span className="text-slate-500 font-medium">Đang Hoạt Động</span>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl"><FiTag /></div>
                        </Div>
                        <H level={2} className="text-4xl font-bold text-slate-800">{totalActive}</H>
                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1"><FiTrendingUp /> chiến dịch đang chạy</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <Div vitri="row_between" className="mb-4">
                            <span className="text-slate-500 font-medium">Tổng Lượt Sử Dụng</span>
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl"><FiUsers /></div>
                        </Div>
                        <H level={2} className="text-4xl font-bold text-slate-800">{totalUsed}</H>
                        <p className="text-sm text-slate-500 mt-2">Lượt áp dụng trên toàn chuỗi</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg relative overflow-hidden group text-white">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <Div vitri="row_between" className="mb-4">
                            <span className="text-slate-300 font-medium">Ngân Sách Ước Tính</span>
                            <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center text-xl"><FiDollarSign /></div>
                        </Div>
                        <H level={2} className="text-4xl font-bold text-white">0đ</H>
                        <p className="text-sm text-slate-400 mt-2">Tính năng phân tích đang cập nhật</p>
                    </motion.div>
                </div>
            </Div>

            {/* Filter & Search */}
            <Div vitri="row_between" className="w-full bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex-wrap gap-4">
                <div className="flex items-center p-1 bg-slate-50 rounded-xl">
                    {(['ALL', 'ACTIVE', 'EXPIRED'] as const).map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                                activeTab === tab 
                                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            {tab === 'ALL' ? 'Tất cả' : tab === 'ACTIVE' ? 'Đang chạy' : 'Đã kết thúc'}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80 pr-2">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm mã khuyến mãi..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-700 placeholder-slate-400"
                    />
                </div>
            </Div>

            {/* Cards Grid */}
            {isLoading ? (
                <div className="w-full py-20 flex justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : filteredPromotions.length === 0 ? (
                <div className="w-full py-20 flex flex-col items-center justify-center text-slate-400">
                    <FiTag className="text-6xl mb-4 opacity-50" />
                    <H level={3} className="text-xl font-bold text-slate-600">Không tìm thấy chiến dịch nào</H>
                    <p className="mt-2">Thử điều chỉnh bộ lọc hoặc tạo mới.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                    {filteredPromotions.map((promo: any) => (
                        <motion.div 
                            key={promo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1">
                                    <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-lg font-bold tracking-widest text-sm w-fit border border-slate-200">
                                        {promo.code}
                                    </span>
                                    <div className="mt-1">
                                        <h3 className="text-lg font-bold text-slate-800 flex items-baseline flex-wrap">
                                            {promo.discountType === 'PERCENTAGE' ? `Giảm ${promo.discountValue}%` : `Giảm ${promo.discountValue.toLocaleString()}đ`}
                                            {promo.maxDiscount && <span className="text-sm text-slate-500 font-medium ml-1 whitespace-nowrap">(Tối đa {promo.maxDiscount.toLocaleString()}đ)</span>}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">Đơn tối thiểu: {promo.minOrderValue ? promo.minOrderValue.toLocaleString() + 'đ' : '0đ'}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 h-fit ${
                                    promo.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full ${promo.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                                    {promo.status === 'ACTIVE' ? 'ACTIVE' : 'EXPIRED'}
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 py-3 border-y border-dashed border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <FiCalendar className="text-indigo-500" />
                                    <span>{new Intl.DateTimeFormat('vi-VN').format(new Date(promo.validFrom))} - {new Intl.DateTimeFormat('vi-VN').format(new Date(promo.validUntil))}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <FiClock className="text-orange-500 min-w-4" />
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span>
                                            {promo.daysOfWeek?.length === 7 
                                                ? 'Cả tuần' 
                                                : promo.daysOfWeek?.map((d: string) => {
                                                    const map: any = {
                                                        'MONDAY': 'Thứ 2',
                                                        'TUESDAY': 'Thứ 3',
                                                        'WEDNESDAY': 'Thứ 4',
                                                        'THURSDAY': 'Thứ 5',
                                                        'FRIDAY': 'Thứ 6',
                                                        'SATURDAY': 'Thứ 7',
                                                        'SUNDAY': 'CN'
                                                    };
                                                    return map[d] || d;
                                                }).join(', ')}
                                        </span>
                                        {promo.timeStart && promo.timeEnd && (
                                            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-xs font-semibold whitespace-nowrap">
                                                {promo.timeStart} - {promo.timeEnd}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Đã dùng / Giới hạn</span>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-lg font-bold text-slate-800">{promo.usedCount}</span>
                                        <span className="text-sm text-slate-400">/ {promo.usageLimit || '∞'}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => router.push(`/quan-ly-thuong-hieu/promotions/${promo.id}/edit`)}
                                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors font-semibold text-sm"
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <button 
                                        onClick={() => setDeletingId(promo.id)}
                                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors"
                                    >
                                        <FiTag className="rotate-45" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <ConfirmModal 
                open={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={handleDelete}
                title="Xóa Chiến Dịch Khuyến Mãi"
                content="Bạn có chắc chắn muốn xóa chiến dịch này không? Hành động này sẽ không thể khôi phục và mã này sẽ ngưng hoạt động trên toàn chuỗi."
                confirmText={isDeleting ? "Đang xóa..." : "Xóa Vĩnh Viễn"}
            />
        </FadeIn>
    );
};

export default PromotionsControlCenter;
