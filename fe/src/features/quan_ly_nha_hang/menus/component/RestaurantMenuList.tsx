"use client";

import React, { useState } from "react";
import { useGetRestaurantMenu } from "../hook/useGetRestaurantMenu";
import { useUpdateRestaurantMenu } from "../hook/useUpdateRestaurantMenu";
import { RestaurantMenuItemResponse } from "../type/menu.type";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { Button } from "@/src/core/components/ui/Button";
import { Input } from "@/src/core/components/ui/Input";
import useDebounce from "@/src/core/hooks/useDebounce";
import { BsSearch, BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { MdOutlineRestaurantMenu, MdPriceChange } from "react-icons/md";

interface Props {
    restaurantId: string;
}

export const RestaurantMenuList: React.FC<Props> = ({ restaurantId }) => {
    const { user } = useAuthStore();
    const isManager = user?.role === "Quản lý nhà hàng" || user?.role === "Admin" || user?.role === "Quản lý thương hiệu";

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce({ value: searchTerm, delay: 1000 });
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [selectedMenuId, setSelectedMenuId] = useState<string>("ALL");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    const { data, isLoading, isError } = useGetRestaurantMenu(restaurantId, {
        page,
        limit,
        search: debouncedSearch,
        isAvailable: statusFilter === "ALL" ? undefined : statusFilter === "AVAILABLE",
        menuId: selectedMenuId === "ALL" ? undefined : selectedMenuId,
        categoryId: selectedCategoryId === "ALL" ? undefined : selectedCategoryId
    });

    const { mutate: updateMenu, isPending: isUpdating } = useUpdateRestaurantMenu();

    // State for price edit modal
    const [editingItem, setEditingItem] = useState<RestaurantMenuItemResponse | null>(null);
    const [newPrice, setNewPrice] = useState<string>("");

    const items: RestaurantMenuItemResponse[] = data?.metadata?.items || [];
    const menus = data?.metadata?.menus || [];
    const allCategories = data?.metadata?.categories || [];
    const pagination = data?.metadata?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

    // Nếu có chọn Menu thì lọc danh mục thuộc Menu đó, ngược lại hiển thị tất cả danh mục
    const categories = selectedMenuId === "ALL"
        ? allCategories
        : allCategories.filter(cat => cat.menuMaps?.some(m => m.menuId === selectedMenuId));

    const handleToggleAvailability = (item: RestaurantMenuItemResponse) => {
        updateMenu({
            restaurantId,
            menuItemId: item.id,
            data: { isAvailable: !item.isAvailable }
        });
    };

    const handleOpenPriceModal = (item: RestaurantMenuItemResponse) => {
        setEditingItem(item);
        setNewPrice(item.overridePrice !== null && item.overridePrice !== undefined ? item.overridePrice.toString() : "");
    };

    const handleSavePrice = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        const parsedPrice = newPrice.trim() === "" ? null : Number(newPrice);
        if (parsedPrice !== null && (isNaN(parsedPrice) || parsedPrice < 0)) {
            return;
        }

        updateMenu(
            {
                restaurantId,
                menuItemId: editingItem.id,
                data: { overridePrice: parsedPrice }
            },
            {
                onSuccess: () => {
                    setEditingItem(null);
                }
            }
        );
    };

    if (isLoading) {
        return (
            <div className="w-full py-12 flex flex-col items-center justify-center gap-3 text-gray-500">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p>Đang tải danh sách thực đơn...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full py-12 bg-red-50 text-red-600 rounded-2xl p-6 text-center">
                <p className="font-semibold">Có lỗi xảy ra khi tải thực đơn chi nhánh.</p>
            </div>
        );
    }

    return (
        <FadeIn className="w-full flex flex-col gap-6">
            {/* Filters Bar */}
            <div className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                    <BsSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm theo tên món..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-gray-800"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {[
                        { label: "Tất cả", value: "ALL" },
                        { label: "Đang phục vụ", value: "AVAILABLE" },
                        { label: "Tạm hết hàng", value: "UNAVAILABLE" }
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => {
                                setStatusFilter(tab.value);
                                setPage(1);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                statusFilter === tab.value
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menus & Categories Filter Bar */}
            {(menus.length > 0 || allCategories.length > 0) && (
                <div className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
                    {/* Menu Filter */}
                    {menus.length > 0 && (
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="text-xs font-semibold uppercase text-gray-500 whitespace-nowrap">Thực đơn:</span>
                            <select
                                value={selectedMenuId}
                                onChange={(e) => {
                                    setSelectedMenuId(e.target.value);
                                    setSelectedCategoryId("ALL"); // reset category khi đổi menu
                                    setPage(1);
                                }}
                                className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500/20 bg-gray-50/50 w-full md:w-auto min-w-[150px]"
                            >
                                <option value="ALL">Tất cả thực đơn</option>
                                {menus.map((m) => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Category Filter */}
                    {allCategories.length > 0 && (
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="text-xs font-semibold uppercase text-gray-500 whitespace-nowrap">Danh mục:</span>
                            <select
                                value={selectedCategoryId}
                                onChange={(e) => {
                                    setSelectedCategoryId(e.target.value);
                                    setPage(1);
                                }}
                                className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500/20 bg-gray-50/50 w-full md:w-auto min-w-[150px]"
                            >
                                <option value="ALL">Tất cả danh mục</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(selectedMenuId !== "ALL" || selectedCategoryId !== "ALL" || searchTerm !== "" || statusFilter !== "ALL") && (
                        <button
                            onClick={() => {
                                setSelectedMenuId("ALL");
                                setSelectedCategoryId("ALL");
                                setSearchTerm("");
                                setStatusFilter("ALL");
                                setPage(1);
                            }}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline ml-auto whitespace-nowrap"
                        >
                            Xóa bộ lọc
                        </button>
                    )}
                </div>
            )}

            {/* Menu Grid/Table */}
            {items.length === 0 ? (
                <div className="w-full bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 flex flex-col items-center gap-3">
                    <MdOutlineRestaurantMenu className="text-5xl text-gray-300" />
                    <p className="text-lg font-medium text-gray-600">Không tìm thấy món ăn nào</p>
                    <p className="text-sm">Vui lòng thử từ khóa hoặc bộ lọc khác.</p>
                </div>
            ) : (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => {
                        const currentPrice = item.overridePrice !== null && item.overridePrice !== undefined ? item.overridePrice : item.basePrice;
                        const hasOverride = item.overridePrice !== null && item.overridePrice !== undefined && item.overridePrice !== item.basePrice;
                        const categoryName = item.categoryMaps?.[0]?.category?.name || "Khác";
                        const mainMenuName = item.categoryMaps?.[0]?.category?.menuMaps?.[0]?.menu?.name || "Thực đơn chính";

                        return (
                            <div
                                key={item.id}
                                className={`w-full bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                                    item.isAvailable ? "border-gray-100 shadow-sm hover:shadow-md" : "border-red-100 bg-red-50/20 opacity-80"
                                }`}
                            >
                                <div className="p-5 flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                                                    <MdOutlineRestaurantMenu className="text-2xl" />
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1.5">
                                                <h3 className="font-bold text-gray-800 text-base line-clamp-2">{item.name}</h3>
                                                <div className="flex flex-wrap items-center gap-1">
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                                                        <span>{mainMenuName}</span>
                                                        <span className="text-gray-300">•</span>
                                                        <span>{categoryName}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price section */}
                                    <div className="mt-2 flex items-center justify-between pt-3 border-t border-gray-100/80">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400">Giá bán chi nhánh:</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-indigo-600">
                                                    {currentPrice.toLocaleString("vi-VN")}đ
                                                </span>
                                                {hasOverride && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        {item.basePrice.toLocaleString("vi-VN")}đ
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {isManager && (
                                            <button
                                                onClick={() => handleOpenPriceModal(item)}
                                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium"
                                                title="Sửa giá chi nhánh"
                                            >
                                                <MdPriceChange className="text-lg text-indigo-600" />
                                                Sửa giá
                                            </button>
                                        )}
                                    </div>

                                    {/* Size Variants Display */}
                                    {item.variants && item.variants.length > 0 && (
                                        <div className="mt-3 pt-2.5 border-t border-gray-100/80 flex flex-col gap-1.5">
                                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Bảng giá theo Size:</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {item.variants.map((v) => (
                                                    <div key={v.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 hover:bg-indigo-50/50 border border-gray-200/60 rounded-lg text-xs transition-colors">
                                                        <span className="font-bold text-gray-700">{v.name}:</span>
                                                        <span className="font-semibold text-indigo-600">{v.price.toLocaleString("vi-VN")}đ</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Toppings / Modifiers Display */}
                                    {item.modifierGroups && item.modifierGroups.length > 0 && (
                                        <div className="mt-3 pt-2.5 border-t border-gray-100/80 flex flex-col gap-2">
                                            {item.modifierGroups.map((group) => (
                                                <div key={group.id} className="flex flex-col gap-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{group.name}</span>
                                                        <span className="text-[10px] text-gray-400 font-medium">
                                                            (Chọn {group.minSelections} - {group.maxSelections})
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {group.options && group.options.map((opt) => (
                                                            <div key={opt.id} className="flex items-center gap-1 px-2 py-0.5 bg-amber-50/70 border border-amber-200/50 rounded-md text-[11px] text-amber-900">
                                                                <span>{opt.name}</span>
                                                                {opt.priceExtra > 0 && (
                                                                    <span className="font-bold text-amber-700">+{opt.priceExtra.toLocaleString("vi-VN")}đ</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Availability Toggle Footer */}
                                <div className="px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        {item.isActive === false ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-200/80 px-2.5 py-1 rounded-full border border-gray-300/50" title="Món này đã bị dừng kinh doanh toàn chuỗi bởi Trụ sở Thương hiệu">
                                                🔒 Tạm ngưng từ Trụ sở
                                            </span>
                                        ) : item.isAvailable ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                                <BsCheckCircleFill className="text-emerald-500" />
                                                Đang phục vụ
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                                                <BsXCircleFill className="text-red-500" />
                                                Tạm hết hàng
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleToggleAvailability(item)}
                                        disabled={isUpdating || item.isActive === false}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${
                                            item.isActive === false
                                                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none"
                                                : item.isAvailable
                                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                                        }`}
                                        title={item.isActive === false ? "Món ăn bị tạm ngưng từ Trụ sở, bạn không thể thay đổi trạng thái." : undefined}
                                    >
                                        {item.isActive === false ? "Đã bị khóa" : item.isAvailable ? "Báo hết hàng" : "Mở bán lại"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination UI */}
            {pagination.total > 0 && (
                <div className="w-full bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-gray-500 font-medium">
                        Hiển thị {((pagination.page - 1) * pagination.limit) + 1} đến {Math.min(pagination.page * pagination.limit, pagination.total)} của {pagination.total} món ăn
                    </span>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Hiển thị:</span>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="border border-gray-200 rounded-lg px-2.5 py-1 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500/20"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={pagination.page <= 1}
                                className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                            >
                                Trước
                            </button>
                            <span className="px-3 py-1.5 text-sm font-semibold text-indigo-600">
                                {pagination.page} / {pagination.totalPages || 1}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={pagination.page >= pagination.totalPages}
                                className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Price Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100 flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <MdPriceChange className="text-2xl text-indigo-600" />
                                Sửa giá chi nhánh
                            </h3>
                            <button
                                onClick={() => setEditingItem(null)}
                                className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-gray-700">Món ăn: <span className="font-bold">{editingItem.name}</span></p>
                            <p className="text-xs text-gray-500">Giá niêm yết thương hiệu: <span className="font-semibold text-gray-700">{editingItem.basePrice.toLocaleString("vi-VN")}đ</span></p>
                        </div>

                        <form onSubmit={handleSavePrice} className="flex flex-col gap-4 mt-2">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-600 uppercase">
                                    Giá bán mới tại chi nhánh (VNĐ)
                                </label>
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder={`Để trống nếu muốn dùng giá gốc (${editingItem.basePrice.toLocaleString("vi-VN")}đ)`}
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500/20"
                                />
                                <span className="text-[11px] text-gray-400 italic">
                                    * Xóa trắng ô nhập và lưu nếu bạn muốn khôi phục về giá niêm yết của thương hiệu.
                                </span>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                                <Button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-5 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    {isUpdating ? "Đang lưu..." : "Lưu giá bán"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </FadeIn>
    );
};

export default RestaurantMenuList;
