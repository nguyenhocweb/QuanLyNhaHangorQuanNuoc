import React, { useState } from "react";
import { Div, H, Button, Table } from "@/src/core/components/ui";
import { useGetMenus, useUpdateMenu, useDeleteMenu } from "../../hook/useMenuCore";
import { FaPlus, FaSearch, FaEdit, FaEye, FaEyeSlash, FaTrash, FaBookOpen } from "react-icons/fa";
import MenuForm from "../forms/MenuForm";
import FadeIn from "@/src/core/components/animation/FadeIn";
import useDebounce from "@/src/core/hooks/useDebounce";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { MenuData } from "../../schema/menu_core.schema";

const MenuTab = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [editingMenu, setEditingMenu] = useState<MenuData | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { mutate: updateMenu } = useUpdateMenu();
    const { mutate: deleteMenu, isPending: isDeleting } = useDeleteMenu();
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce({ value: search, delay: 500 });
    const [isActive, setIsActive] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("");
    const debouncedSortOrder = useDebounce({ value: sortOrder, delay: 500 });
    
    const { data: response, isLoading } = useGetMenus({ 
        page, 
        limit,
        search: debouncedSearch,
        is_active: isActive !== "" ? isActive : undefined,
        sort_order: debouncedSortOrder !== "" ? debouncedSortOrder : undefined
    });
    
    const menus = response?.metadata?.data || [];
    const meta = response?.metadata?.meta;

    const handleDelete = (id: string) => {
        setDeletingId(id);
    };

    const handleConfirmDelete = () => {
        if (deletingId) {
            deleteMenu(deletingId, {
                onSettled: () => setDeletingId(null)
            });
        }
    };

    const handleToggleActive = (menu: MenuData) => {
        updateMenu({ 
            id: menu.id, 
            data: { is_active: !menu.is_active }
        });
    };

    return (
        <FadeIn className="w-full">
            <Div vitri="col_none" className="w-full gap-6">
                <Div className="w-full flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <H level={4} className="text-xl font-bold text-gray-800">Quản lý Thực đơn</H>
                    <Button 
                        onClick={() => setIsCreating(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                    >
                        <FaPlus className="w-4 h-4" />
                        Thêm thực đơn
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
                </div>

                {/* Bảng dữ liệu */}
                <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[400px]">
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : menus.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <FaBookOpen className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có thực đơn nào</h3>
                            <p className="text-gray-500 max-w-sm mb-4">Bạn chưa tạo thực đơn nào hoặc không có kết quả phù hợp với tìm kiếm.</p>
                            <Button 
                                onClick={() => setIsCreating(true)}
                                className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-2"
                            >
                                <FaPlus className="w-4 h-4" /> Thêm thực đơn ngay
                            </Button>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                        <Table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                    <th className="px-6 py-4 rounded-tl-xl">Thực đơn</th>
                                    <th className="px-6 py-4">Thứ tự</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4 text-right rounded-tr-xl">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {menus.map((menu: MenuData) => (
                                    <tr key={menu.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                                                    <FaBookOpen className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{menu.name}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{menu.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-medium text-gray-700">
                                                {menu.sort_order}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${menu.is_active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                                {menu.is_active ? "Hoạt động" : "Đang ẩn"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleToggleActive(menu)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title={menu.is_active ? "Ẩn thực đơn" : "Hiện thực đơn"}
                                                >
                                                    {menu.is_active ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                                </button>
                                                <button 
                                                    onClick={() => setEditingMenu(menu)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Sửa thực đơn"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(menu.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xóa thực đơn"
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
                    
                    {!isLoading && menus.length > 0 && meta && (
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
            {(isCreating || editingMenu) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-auto">
                        <MenuForm 
                            onCancel={() => { setIsCreating(false); setEditingMenu(null); }} 
                            initialData={editingMenu}
                            isEdit={!!editingMenu}
                        />
                    </div>
                </div>
            )}

            <ConfirmModal 
                open={!!deletingId}
                title="Xác nhận xóa thực đơn"
                content="Bạn có chắc chắn muốn xóa thực đơn này? Lưu ý: Không thể xóa thực đơn nếu đang có danh mục thuộc về thực đơn này."
                type="danger"
                isLoading={isDeleting}
                confirmText="Xóa thực đơn"
                onClose={() => setDeletingId(null)}
                onConfirm={handleConfirmDelete}
            />
        </FadeIn>
    );
};

export default MenuTab;
