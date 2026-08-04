import React, { useState } from "react";
import { Div, H, Button, Table } from "@/src/core/components/ui";
import { useGetMenuCategories, useUpdateMenuCategory, useDeleteMenuCategory } from "../../hook/useMenuCategory";
import { FaPlus, FaSearch, FaEdit, FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import CategoryForm from "../forms/CategoryForm";
import FadeIn from "@/src/core/components/animation/FadeIn";
import useDebounce from "@/src/core/hooks/useDebounce";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";

const MenuCategoryTab = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { mutate: updateCategory } = useUpdateMenuCategory();
    const { mutate: deleteCategory, isPending: isDeleting } = useDeleteMenuCategory();
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce({ value: search, delay: 500 });
    const [isActive, setIsActive] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("");
    const debouncedSortOrder = useDebounce({ value: sortOrder, delay: 500 });
    
    const { data: response, isLoading } = useGetMenuCategories({ 
        page, 
        limit,
        search: debouncedSearch,
        is_active: isActive !== "" ? isActive : undefined,
        sort_order: debouncedSortOrder !== "" ? debouncedSortOrder : undefined
    });
    const categories = response?.metadata?.data || [];
    const meta = response?.metadata?.meta;

    const handleDelete = (id: string) => {
        setDeletingId(id);
    };

    const handleConfirmDelete = () => {
        if (deletingId) {
            deleteCategory({ id: deletingId, successMessage: "Đã xóa danh mục thành công!" }, {
                onSettled: () => setDeletingId(null)
            });
        }
    };

    const handleToggleActive = (cat: any) => {
        updateCategory({ 
            id: cat.id, 
            data: { is_active: !cat.is_active },
            successMessage: !cat.is_active ? "Đã hiển thị danh mục!" : "Đã ẩn danh mục!"
        });
    };

    return (
        <FadeIn className="w-full">
            <Div vitri="col_none" className="w-full gap-6">
                <Div className="w-full flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <H level={4} className="text-xl font-bold text-gray-800">Danh mục món ăn</H>
                    <Button 
                        onClick={() => setIsCreating(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                    >
                        <FaPlus className="w-4 h-4" />
                        Thêm danh mục
                    </Button>
                </Div>

                {/* Bộ lọc và Tìm kiếm */}
                <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 min-w-[150px]">
                        <span className="text-sm text-gray-500 font-medium">Trạng thái:</span>
                        <select
                            value={isActive}
                            onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
                            className="flex-1 py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                        >
                            <option value="">Tất cả</option>
                            <option value="true">Hoạt động</option>
                            <option value="false">Đang ẩn</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 min-w-[150px]">
                        <span className="text-sm text-gray-500 font-medium">Ưu tiên:</span>
                        <input
                            type="number"
                            placeholder="Số thứ tự..."
                            value={sortOrder}
                            onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                            className="w-24 py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>
                </div>

                <div className="w-full flex flex-col justify-between bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[calc(100vh-240px)]">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
                    ) : categories.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Chưa có danh mục nào. Hãy tạo danh mục đầu tiên!</div>
                    ) : (
                        <div className="flex-1 overflow-auto">
                            <Table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Tên Danh Mục</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Thuộc Thực Đơn</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Mô Tả</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Thứ tự ưu tiên</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Trạng Thái</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.map((cat: any) => (
                                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{cat.name}</td>
                                        <td className="px-6 py-4 text-sm text-indigo-600 font-medium">
                                            {cat.menuMaps?.length > 0 ? cat.menuMaps.map((m: any) => m.menu.name).join(', ') : "—"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{cat.description || "—"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-center font-medium">{cat.sort_order ?? 0}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {cat.is_active ? "Hoạt động" : "Đang ẩn"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleToggleActive(cat)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title={cat.is_active ? "Ẩn danh mục" : "Hoạt động danh mục"}
                                                >
                                                    {cat.is_active ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                                </button>
                                                <button 
                                                    onClick={() => setEditingCategory(cat)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Sửa danh mục"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xóa danh mục"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        </div>
                    )}
                    
                    {!isLoading && categories.length > 0 && meta && (
                        <div className="mt-auto flex w-full items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                            <div className="text-sm text-gray-500">
                                Hiển thị <span className="font-medium text-gray-800">{(page - 1) * limit + 1}</span> đến <span className="font-medium text-gray-800">{Math.min(page * limit, meta.total || 0)}</span> của <span className="font-medium text-gray-800">{meta.total || 0}</span> kết quả
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>Số dòng:</span>
                                    <select 
                                        value={limit}
                                        onChange={(e) => {
                                            setLimit(Number(e.target.value));
                                            setPage(1);
                                        }}
                                        className="border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none p-1 bg-white cursor-pointer"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                <button 
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Trước
                                </button>
                                <button 
                                    disabled={page >= (meta.totalPages || 1)}
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </Div>

            {/* Modal Overlay cho Form Tạo mới / Sửa */}
            {(isCreating || editingCategory) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-auto">
                        <CategoryForm 
                            onCancel={() => { setIsCreating(false); setEditingCategory(null); }} 
                            initialData={editingCategory}
                            isEdit={!!editingCategory}
                        />
                    </div>
                </div>
            )}

            <ConfirmModal 
                open={!!deletingId}
                title="Xác nhận xóa danh mục"
                content="Bạn có chắc chắn muốn xóa danh mục này? Hệ thống sẽ không cho phép xóa nếu danh mục đang chứa món ăn."
                type="danger"
                isLoading={isDeleting}
                confirmText="Xóa danh mục"
                onClose={() => setDeletingId(null)}
                onConfirm={handleConfirmDelete}
            />
        </FadeIn>
    );
};

export default MenuCategoryTab;
