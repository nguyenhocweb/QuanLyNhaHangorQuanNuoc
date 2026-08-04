import React, { useState } from "react";
import { Div, H, Button, Table } from "@/src/core/components/ui";
import { useGetMenuItems, useUpdateMenuItem, useDeleteMenuItem } from "../../hook/useMenuItem";
import { FaPlus, FaImage, FaEdit, FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import MenuItemForm from "../forms/MenuItemForm";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";

const MenuItemsTab = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    
    const { data: response, isLoading } = useGetMenuItems({ page, limit });
    const { mutate: updateMenuItem } = useUpdateMenuItem();
    const { mutate: deleteMenuItem, isPending: isDeleting } = useDeleteMenuItem();

    const items = response?.metadata?.data || [];
    const meta = response?.metadata?.meta;

    const handleDelete = (id: string) => {
        setDeletingId(id);
    };

    const handleConfirmDelete = () => {
        if (deletingId) {
            deleteMenuItem({ id: deletingId, successMessage: "Đã xóa món ăn thành công!" }, {
                onSettled: () => setDeletingId(null)
            });
        }
    };

    const handleToggleActive = (item: any) => {
        updateMenuItem({ 
            id: item.id, 
            data: { isActive: !item.isActive },
            successMessage: !item.isActive ? "Đã mở bán món ăn!" : "Đã tạm ngưng món ăn!"
        });
    };


    return (
        <FadeIn className="w-full">
            <Div vitri="col_none" className="w-full gap-6">
                <Div className="w-full flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <H level={4} className="text-xl font-bold text-gray-800">Danh sách món ăn</H>
                    <Button 
                        onClick={() => setIsCreating(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                    >
                        <FaPlus className="w-4 h-4" />
                        Thêm món mới
                    </Button>
                </Div>

                <div className="w-full flex flex-col justify-between bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[calc(100vh-240px)]">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
                    ) : items.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Chưa có món ăn nào. Hãy tạo món đầu tiên!</div>
                    ) : (
                        <div className="flex-1 overflow-auto">
                            <Table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Món ăn</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Danh mục</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Giá cơ bản</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <FaImage className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {item.categoryMaps?.length > 0 ? item.categoryMaps.map((c: any) => c.category.name).join(', ') : "—"}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.basePrice)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {item.isActive ? "Đang bán" : "Tạm ngưng"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleToggleActive(item)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title={item.isActive ? "Tạm ngưng" : "Mở bán"}
                                                >
                                                    {item.isActive ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                                </button>
                                                <button 
                                                    onClick={() => setEditingItem(item)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Sửa món ăn"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xóa món ăn"
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
                    
                    {!isLoading && items.length > 0 && meta && (
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
            {(isCreating || editingItem) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl my-auto">
                        <MenuItemForm 
                            onCancel={() => { setIsCreating(false); setEditingItem(null); }} 
                            initialData={editingItem}
                            isEdit={!!editingItem}
                        />
                    </div>
                </div>
            )}

            <ConfirmModal 
                open={!!deletingId}
                title="Xác nhận xóa món ăn"
                content="Bạn có chắc chắn muốn xóa món ăn này? Hệ thống sẽ xóa toàn bộ các biến thể, nhóm tùy chọn và phân bổ liên quan đến món ăn này."
                type="danger"
                isLoading={isDeleting}
                confirmText="Xóa món ăn"
                onClose={() => setDeletingId(null)}
                onConfirm={handleConfirmDelete}
            />
        </FadeIn>
    );
};
export default MenuItemsTab;
