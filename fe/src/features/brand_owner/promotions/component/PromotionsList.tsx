"use client";

import React, { useState } from 'react';
import { Div, H, P, Button } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { useGetPromotions } from "../hook/useGetPromotions";
import { useDeletePromotion } from "../hook/useDeletePromotion";
import useDebounce from "@/src/core/hooks/useDebounce";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { RiCoupon3Line } from "react-icons/ri";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import CreatePromotionModal from "./CreatePromotionModal";
import UpdatePromotionModal from "@/src/features/brand_owner/promotions/component/UpdatePromotionModal";


const PromotionsList = () => {
    const { user } = useAuthStore();
    const brandId = user?.brand?.[0]?.id || "";

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce({ value: searchTerm, delay: 500 });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingPromotionId, setEditingPromotionId] = useState<string | null>(null);
    const [deletingPromotionId, setDeletingPromotionId] = useState<string | null>(null);

    const { data, isLoading } = useGetPromotions(brandId, {
        page,
        limit: 10,
        search: debouncedSearch
    });

    const { mutate: deletePromotion, isPending: isDeleting } = useDeletePromotion();

    const handleDelete = () => {
        if (deletingPromotionId) {
            deletePromotion(
                { brandId, promotionId: deletingPromotionId },
                {
                    onSuccess: () => setDeletingPromotionId(null)
                }
            );
        }
    };

    return (
        <FadeIn className="w-full flex flex-col gap-6 p-6">
            {/* Header */}
            <Div vitri="row_between" className="w-full">
                <Div className="gap-2">
                    <Div vitri="row_center" className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600">
                        <RiCoupon3Line className="text-xl" />
                    </Div>
                    <Div vitri="col_none" className="gap-1">
                        <H level={2} className="text-xl font-bold text-gray-800">Khuyến Mãi</H>
                        <P className="text-sm text-gray-500">Quản lý mã giảm giá và chiến dịch khuyến mãi toàn chuỗi</P>
                    </Div>
                </Div>
                <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                    <FiPlus /> Thêm Khuyến Mãi
                </Button>
            </Div>

            {/* Search Bar */}
            <Div vitri="row_center" className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <Div className="relative w-full max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm theo mã khuyến mãi..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    />
                </Div>
            </Div>

            {/* Content Table */}
            <Div vitri="col_none" className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm font-medium">
                                <th className="p-4 font-medium">Mã KM</th>
                                <th className="p-4 font-medium">Loại Giảm</th>
                                <th className="p-4 font-medium">Mức Giảm</th>
                                <th className="p-4 font-medium">Thời Hạn</th>
                                <th className="p-4 font-medium">Đã Dùng</th>
                                <th className="p-4 font-medium">Trạng Thái</th>
                                <th className="p-4 font-medium text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                                </tr>
                            ) : data?.items?.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">Chưa có khuyến mãi nào.</td>
                                </tr>
                            ) : (
                                data?.items?.map((promo: any) => (
                                    <tr key={promo.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded-lg">{promo.code}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${promo.discount_type === 'PERCENTAGE' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                {promo.discount_type === 'PERCENTAGE' ? 'Phần trăm' : 'Tiền mặt'}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-gray-700">
                                            {promo.discount_type === 'PERCENTAGE' ? `${promo.discount_value}%` : `${promo.discount_value.toLocaleString()}đ`}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Intl.DateTimeFormat('vi-VN').format(new Date(promo.valid_from))} - {new Intl.DateTimeFormat('vi-VN').format(new Date(promo.valid_until))}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {promo.used_count} {promo.usage_limit ? `/ ${promo.usage_limit}` : ''}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${promo.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {promo.isActive ? 'Đang chạy' : 'Đã dừng'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <Div vitri="row_end" className="gap-2">
                                                <button 
                                                    onClick={() => setEditingPromotionId(promo.id)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button 
                                                    onClick={() => setDeletingPromotionId(promo.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </Div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {data?.meta && data.meta.totalPages > 1 && (
                    <Div vitri="row_between" className="p-4 border-t border-gray-100 bg-gray-50/50">
                        <span className="text-sm text-gray-500">
                            Hiển thị trang {data.meta.page} / {data.meta.totalPages}
                        </span>
                        <Div className="gap-2">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                            >
                                Trước
                            </button>
                            <button 
                                disabled={page === data.meta.totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                            >
                                Sau
                            </button>
                        </Div>
                    </Div>
                )}
            </Div>

            {/* Modals */}
            <CreatePromotionModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                brandId={brandId} 
            />
            {editingPromotionId && (
                <UpdatePromotionModal 
                    isOpen={!!editingPromotionId} 
                    onClose={() => setEditingPromotionId(null)} 
                    brandId={brandId} 
                    promotionId={editingPromotionId} 
                    initialData={data?.items?.find((p: any) => p.id === editingPromotionId)}
                />
            )}
            <ConfirmModal 
                open={!!deletingPromotionId}
                onClose={() => setDeletingPromotionId(null)}
                onConfirm={handleDelete}
                title="Xóa khuyến mãi"
                content="Bạn có chắc chắn muốn xóa mã khuyến mãi này không? Hành động này không thể hoàn tác."
                confirmText={isDeleting ? "Đang xóa..." : "Xóa"}
            />
        </FadeIn>
    );
};

export default PromotionsList;
