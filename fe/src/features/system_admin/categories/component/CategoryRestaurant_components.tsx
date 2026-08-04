"use client";
import React, { useState } from "react";
import { Div, Button, Input, Select, H, P } from "@/src/core/components/ui"
import { FiSearch, FiEdit2, FiTrash2, FiLayers, FiChevronLeft, FiChevronRight, FiLoader, FiPlus, FiPlusCircle, FiLock } from "react-icons/fi";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useCategoryRestaurant } from "../hook/useCategoryRestaurant_hook";
import { useUpdateCategoryRestaurant } from "../hook/useUpdateCategoryRestaurant_hook";
import { useDeleteCategoryRestaurant } from "../hook/useDeleteCategoryRestaurant_hook";
import UpdateCategoryRestaurant from "./updateCategoryRestaurant_Form";
import CreateCategoryRestaurant from "./createCategoryRestaurant_Form";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";

const CategoryRestaurantComponent = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [isUpdateModal, setIsUpdateModal] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

    const { data: categoryData, isLoading } = useCategoryRestaurant({ page, limit, search, status });
    const categories = categoryData?.data || [];
    const meta = categoryData?.meta;

    const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategoryRestaurant();
    const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategoryRestaurant();

    const toggleStatus = (id: string, currentStatus: boolean) => {
        updateCategory({ id, isActive: !currentStatus });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset page on new search
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
        setPage(1); // Reset page on status change
    };
    return (
        <>
        <FadeIn delay={0.2} className="w-full mt-6">
            <Div vitri="col_none" variant="bg_white" className="gap-y-6 !p-6 md:!p-8 !rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" size="full">
                
                {/* HEADER */}
                <Div className="w-full justify-between flex-wrap gap-4 items-center border-b border-gray-50 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-xl shadow-sm shadow-indigo-200"><FiLayers /></div>
                    <div>
                      <H variant="text_black" className="text-xl md:text-2xl font-bold text-gray-900">Quản lý Danh mục chuẩn</H>
                      <P className="text-sm text-gray-500 mt-1">Quản lý các loại hình nhà hàng, quán ăn, v.v.</P>
                    </div>
                  </div>
                  <Button onClick={() => setIsCreateModalOpen(true)} variant="default" shape="square" sizea="p4_2" className="flex items-center whitespace-nowrap gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-200 transition-all">
                    <FiPlus className="text-lg" /> Thêm danh mục mới
                  </Button>
                </Div>

                {/* STATS */}
                <Div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FadeIn delay={0.1}>
                    <div className="flex items-center justify-between border border-gray-100 border-l-[4px] border-l-indigo-500 rounded-2xl p-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-xl"><FiLayers /></div>
                        <div className="flex flex-col">
                          <P className="text-[13.5px] text-gray-500 font-medium mb-1">Tổng danh mục</P>
                          <H variant="text_black" className="text-3xl font-bold text-gray-900">{meta?.totalRecords || 0}</H>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                  
                  <FadeIn delay={0.2}>
                    <div className="flex items-center justify-between border border-gray-100 border-l-[4px] border-l-green-500 rounded-2xl p-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center text-xl"><FiPlusCircle /></div>
                        <div className="flex flex-col">
                          <P className="text-[13.5px] text-gray-500 font-medium mb-1">Đang hoạt động</P>
                          <H variant="text_black" className="text-3xl font-bold text-green-600">{meta?.totalActive || 0}</H>
                        </div>
                      </div>
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.3}>
                    <div className="flex items-center justify-between border border-gray-100 border-l-[4px] border-l-red-400 rounded-2xl p-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-xl"><FiLock /></div>
                        <div className="flex flex-col">
                          <P className="text-[13.5px] text-gray-500 font-medium mb-1">Danh mục đã dừng</P>
                          <H variant="text_black" className="text-3xl font-bold text-gray-900">{meta?.totalInactive || 0}</H>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                </Div>
                
                {/* FILTERS */}
                <Div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="relative md:col-span-8 group">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            className="pl-11 w-full text-[15px] text-gray-700 rounded-xl border-gray-200 h-[48px] focus:shadow-md transition-shadow bg-gray-50/50 hover:bg-white"
                            placeholder="Tìm kiếm danh mục nhà hàng..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="relative md:col-span-4 group">
                        <span className="absolute -top-2 left-3 bg-white px-1 text-[12px] text-gray-500 z-10 font-medium group-hover:text-indigo-500 transition-colors">Trạng thái</span>
                        <Select 
                            className="w-full text-[15px] text-gray-700 rounded-xl border-gray-200 h-[48px] focus:shadow-md transition-shadow bg-gray-50/50 hover:bg-white"
                            value={status}
                            onChange={handleStatusChange}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="true">Đang hoạt động</option>
                            <option value="false">Đã dừng</option>
                        </Select>
                    </div>
                </Div>

                {/* TABLE */}
                <div className="w-full overflow-x-auto mt-2 relative rounded-xl border border-gray-100/60">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-500 text-[13px] border-b border-gray-100 font-medium uppercase tracking-wider">
                                <th className="py-4 px-5 w-[5%]">STT</th>
                                <th className="py-4 px-5 w-[30%]">Tên loại hình</th>
                                <th className="py-4 px-5 w-[30%]">Mô tả</th>
                                <th className="py-4 px-5 w-[20%]">Trạng thái</th>
                                <th className="py-4 px-5 w-[15%] text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-gray-400">
                                        <Div className="gap-2">
                                            <FiLoader className="animate-spin text-xl text-indigo-500" />
                                            <span>Đang tải dữ liệu...</span>
                                        </Div>
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-400">
                                        Không tìm thấy danh mục nào.
                                    </td>
                                </tr>
                            ) : categories.map((e, index) => (
                                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors group">
                                    <td className="py-4 px-5 text-[14px] text-gray-500 font-medium">
                                        #{((page - 1) * limit + index + 1).toString().padStart(2, '0')}
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                                                style={{ 
                                                    backgroundColor: e.bgColor || '#EEF2FF',
                                                    color: e.textColor || '#6366F1',
                                                    boxShadow: `0 1px 2px 0 ${e.bgColor || '#EEF2FF'}80`
                                                }}
                                            >
                                                <FiLayers className="text-lg" />
                                            </div>
                                            <span 
                                                className="font-semibold text-[14px] px-3 py-1.5 rounded-lg whitespace-nowrap shadow-sm border border-gray-100"
                                                style={{ 
                                                    backgroundColor: e.bgColor || '#EEF2FF',
                                                    color: e.textColor || '#6366F1'
                                                }}
                                            >
                                                {e.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div 
                                            className="text-gray-500 text-[13px] truncate max-w-[200px] xl:max-w-[300px] cursor-help"
                                            title={e.description || "Không có mô tả"}
                                        >
                                            {e.description || "Không có mô tả"}
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap ${
                                            e.isActive 
                                            ? 'bg-green-50 text-green-600 border border-green-100' 
                                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${e.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                            {e.isActive ? "Đang hoạt động" : "Đã dừng"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                            {/* Toggle Switch Button */}
                                            <button 
                                                onClick={() => toggleStatus(e.id, e.isActive)}
                                                disabled={isUpdating}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                                    e.isActive ? 'bg-indigo-500' : 'bg-gray-200'
                                                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                title={e.isActive ? "Dừng hoạt động" : "Kích hoạt lại"}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    e.isActive ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                            </button>
                                            <Button 
                                                variant="outline" 
                                                sizea="p2_1" 
                                                className="text-gray-500 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 rounded-lg p-2.5 h-9 w-9 flex items-center justify-center transition-all"
                                                title="Chỉnh sửa"
                                                onClick={() => {
                                                    setSelectedCategory(e);
                                                    setIsUpdateModal(true);
                                                }}
                                            >
                                                <FiEdit2 />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                sizea="p2_1" 
                                                className="text-gray-500 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg p-2.5 h-9 w-9 flex items-center justify-center transition-all"
                                                title="Xóa"
                                                onClick={() => {
                                                    setCategoryToDelete(e);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                            >
                                                <FiTrash2 />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* FOOTER SUMMARY & PAGINATION */}
                <Div className="w-full flex flex-col md:flex-row justify-between items-center mt-2 pt-2 gap-4">
                    <Div className="text-[13.5px] text-gray-500 flex flex-wrap items-center gap-4">
                        <span>
                            Tổng: <strong className="text-gray-900">{meta?.totalRecords || 0}</strong> danh mục
                        </span>
                    </Div>

                    <Div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[13.5px] text-gray-500">Hiển thị:</span>
                            <select 
                                className="border border-gray-200 rounded-md text-gray-700 text-[13px] py-1 px-2 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        {meta && meta.totalPages > 1 && (
                            <Div className="flex items-center gap-1.5 bg-gray-50/80 p-1 rounded-xl border border-gray-100">
                                <Button 
                                    variant="outline" 
                                    sizea="p2_1" 
                                    className="border-none hover:bg-white hover:shadow-sm rounded-lg p-2 h-9 w-9 flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <FiChevronLeft />
                                </Button>
                                
                                <div className="flex items-center gap-1 px-2">
                                    {(() => {
                                        const totalPages = meta.totalPages;
                                        const currentPage = page;
                                        
                                        const getPageNumbers = () => {
                                            if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
                                            if (currentPage <= 3) return [1, 2, 3, 4, 5, '...', totalPages];
                                            if (currentPage >= totalPages - 2) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                                            return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
                                        };

                                        return getPageNumbers().map((p, idx) => (
                                            p === '...' ? (
                                                <span key={`dots-${idx}`} className="w-8 text-center text-gray-400 text-[13px]">...</span>
                                            ) : (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p as number)}
                                                    className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-all ${
                                                        page === p 
                                                        ? 'bg-white text-indigo-600 shadow-sm border border-gray-200/60' 
                                                        : 'text-gray-500 hover:bg-white hover:text-gray-900'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        ));
                                    })()}
                                </div>

                                <Button 
                                    variant="outline" 
                                    sizea="p2_1" 
                                    className="border-none hover:bg-white hover:shadow-sm rounded-lg p-2 h-9 w-9 flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
                                    onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                    disabled={page === meta.totalPages}
                                >
                                    <FiChevronRight />
                                </Button>
                            </Div>
                        )}
                    </Div>
                </Div>
                
                {/* UPDATE MODAL */}
                {isUpdateModal && selectedCategory && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <UpdateCategoryRestaurant 
                            initialData={selectedCategory} 
                            onclickClose={() => {
                                setIsUpdateModal(false);
                                setSelectedCategory(null);
                            }} 
                        />
                    </div>
                )}
            </Div>
        </FadeIn>
        {isCreateModalOpen && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <CreateCategoryRestaurant onclickClose={() => setIsCreateModalOpen(false)} />
            </div>
        )}
        <ConfirmModal
            open={isDeleteModalOpen}
            title="Xác nhận xóa danh mục"
            content={`Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete?.name}" không? Hành động này không thể hoàn tác.`}
            type="danger"
            isLoading={isDeleting}
            onClose={() => {
                if (!isDeleting) {
                    setIsDeleteModalOpen(false);
                    setCategoryToDelete(null);
                }
            }}
            onConfirm={() => {
                if (categoryToDelete) {
                    deleteCategory(categoryToDelete.id, {
                        onSuccess: () => {
                            setIsDeleteModalOpen(false);
                            setCategoryToDelete(null);
                        }
                    });
                }
            }}
            confirmText="Xóa"
            cancelText="Hủy"
        />
        </>
    );
};

export default CategoryRestaurantComponent;