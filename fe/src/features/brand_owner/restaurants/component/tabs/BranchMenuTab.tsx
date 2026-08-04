import React, { useState, useEffect } from "react";
import useDebounce from "@/src/core/hooks/useDebounce";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useGetMenuItems } from "@/src/features/brand_owner/menus/hook/useMenuItem";
import { useGetMenuCategories } from "@/src/features/brand_owner/menus/hook/useMenuCategory";
import { useGetMenus } from "@/src/features/brand_owner/menus/hook/useMenuCore";
import { useUpdateBranchMenu } from "../../hook/useUpdateBranchMenu";
import { useDeleteBranchMenu } from "../../hook/useDeleteBranchMenu";
import { FiSearch, FiCheck, FiX, FiEdit2, FiPlus, FiTrash2, FiFilter } from "react-icons/fi";
import { Div } from "@/src/core/components/ui";

interface BranchMenuTabProps {
    id_brand: string;
    restaurantId: string;
}

const MenuItemRow = ({ item, restaurantId, id_brand }: any) => {
    const { mutate: updateMenu, isPending: isUpdating } = useUpdateBranchMenu();
    const { mutate: deleteMenu, isPending: isDeleting } = useDeleteBranchMenu();
    
    // Find mapping for this restaurant
    const mapping = item.restaurantMaps?.length > 0 ? item.restaurantMaps[0] : null;
    const isAssigned = !!mapping;
    
    // State
    const [isAvailable, setIsAvailable] = useState(mapping ? mapping.isAvailable : true);
    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const [priceInput, setPriceInput] = useState(mapping?.overridePrice?.toString() || "");

    // Cập nhật state nếu mapping đổi do API trả về (sau invalidate)
    useEffect(() => {
        if (mapping) {
            setIsAvailable(mapping.isAvailable);
            setPriceInput(mapping.overridePrice?.toString() || "");
        }
    }, [mapping]);

    const handleToggleAvailable = () => {
        const newValue = !isAvailable;
        setIsAvailable(newValue); // Optimistic UI
        updateMenu({
            id_brand,
            restaurantId,
            menuItemId: item.id,
            data: { isAvailable: newValue }
        });
    };

    const handleSavePrice = () => {
        setIsEditingPrice(false);
        const parsed = priceInput ? parseFloat(priceInput) : null;
        updateMenu({
            id_brand,
            restaurantId,
            menuItemId: item.id,
            data: { overridePrice: parsed }
        });
    };

    const handleAssign = () => {
        updateMenu({
            id_brand,
            restaurantId,
            menuItemId: item.id,
            data: { isAvailable: true }
        });
    };

    const handleUnassign = () => {
        deleteMenu({
            id_brand,
            restaurantId,
            menuItemId: item.id
        });
    };

    const isPending = isUpdating || isDeleting;

    // Lấy tên thực đơn (nếu có)
    const menuNames = Array.from(new Set(
        item.categoryMaps?.flatMap((cm: any) => cm.category?.menuMaps?.map((mm: any) => mm.menu?.name) || [])
    )).filter(Boolean);

    return (
        <div className={`flex items-center justify-between p-4 bg-white hover:bg-gray-50 border-b border-gray-100 transition-colors last:border-b-0 group ${!isAssigned ? 'opacity-60 grayscale-[0.5] hover:grayscale-0 hover:opacity-100' : ''}`}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 shadow-sm">
                    {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                            {item.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">{item.name}</h4>
                    <div className="flex flex-col gap-1.5 mt-1">
                        <div className="flex flex-wrap gap-2 items-center text-xs">
                            {menuNames.length > 0 && menuNames.map((mName: any) => (
                                <span key={mName} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-medium">{mName}</span>
                            ))}
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">{item.categoryMaps?.[0]?.category?.name || "Khác"}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 items-center text-xs text-gray-500">
                            <span className="font-medium">Mã: {item.sku || "N/A"}</span>
                            
                            {/* Hiển thị variants (size/giá) nếu có */}
                            {item.variants && item.variants.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 border-l border-gray-200 pl-3">
                                    {item.variants.map((v: any) => (
                                        <span key={v.id} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded whitespace-nowrap">
                                            {v.name}: {v.price?.toLocaleString()}đ
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400 mb-1">Giá gốc: {item.basePrice?.toLocaleString()}đ</span>
                    {isAssigned && (
                        isEditingPrice ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={priceInput}
                                    onChange={(e) => setPriceInput(e.target.value)}
                                    className="w-24 px-2 py-1 border border-green-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                    placeholder="Ghi đè"
                                />
                                <button onClick={handleSavePrice} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors">
                                    <FiCheck />
                                </button>
                                <button onClick={() => setIsEditingPrice(false)} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                                    <FiX />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 group/price cursor-pointer" onClick={() => setIsEditingPrice(true)}>
                                <span className={`font-bold ${mapping?.overridePrice ? "text-orange-500" : "text-gray-700"}`}>
                                    {mapping?.overridePrice ? `${mapping.overridePrice.toLocaleString()}đ` : `${item.basePrice?.toLocaleString()}đ`}
                                </span>
                                <FiEdit2 className="text-gray-300 group-hover/price:text-green-500 transition-colors" />
                            </div>
                        )
                    )}
                </div>

                <div className="flex flex-col items-center gap-1 w-24">
                    {isAssigned ? (
                        <>
                            <span className={`text-xs ${isAvailable ? 'text-green-600 font-medium' : 'text-gray-400'}`}>{isAvailable ? 'Đang bán' : 'Hết hàng'}</span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleToggleAvailable}
                                    disabled={isPending}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isAvailable ? 'bg-green-500' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <button 
                                    onClick={handleUnassign}
                                    disabled={isPending}
                                    title="Ngừng bán món này"
                                    className="h-6 w-6 rounded flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                    <FiTrash2 className="text-sm" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <button 
                            onClick={handleAssign}
                            disabled={isPending}
                            className="flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-green-500 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors shadow-sm w-full"
                        >
                            <FiPlus /> Thêm
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const BranchMenuTab: React.FC<BranchMenuTabProps> = ({ id_brand, restaurantId }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(10);
    const [menuId, setMenuId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [isAssigned, setIsAssigned] = useState("");
    const [isAvailable, setIsAvailable] = useState("");

    const debouncedSearch = useDebounce({ value: search, delay: 500 });

    const { data, isLoading } = useGetMenuItems({
        page,
        limit,
        search: debouncedSearch,
        categoryId,
        menuId,
        restaurantId,
        isAssigned,
        isAvailable
    });

    const { data: categoriesData } = useGetMenuCategories({ page: 1, limit: 100 });
    const { data: menusData } = useGetMenus({ page: 1, limit: 100 });

    return (
        <FadeIn className="w-full flex flex-col gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Cấu hình thực đơn</h3>
                        <p className="text-sm text-gray-500">Phân bổ món ăn, quản lý giá bán riêng và trạng thái hết hàng tại chi nhánh.</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                        <FiFilter /> Bộ lọc:
                    </div>
                    
                    <div className="relative flex-1 min-w-[200px]">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Tìm món ăn..." 
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        />
                    </div>

                    <select 
                        value={menuId} 
                        onChange={(e) => {
                            setMenuId(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    >
                        <option value="">Tất cả thực đơn</option>
                        {menusData?.metadata?.data?.map((menu: any) => (
                            <option key={menu.id} value={menu.id}>{menu.name}</option>
                        ))}
                    </select>

                    <select 
                        value={categoryId} 
                        onChange={(e) => {
                            setCategoryId(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    >
                        <option value="">Tất cả danh mục</option>
                        {categoriesData?.metadata?.data?.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select 
                        value={isAssigned} 
                        onChange={(e) => {
                            setIsAssigned(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    >
                        <option value="">Tất cả trạng thái chọn</option>
                        <option value="true">Đã chọn bán</option>
                        <option value="false">Chưa chọn bán</option>
                    </select>

                    <select 
                        value={isAvailable} 
                        onChange={(e) => {
                            setIsAvailable(e.target.value);
                            setPage(1);
                        }}
                        disabled={isAssigned === "false"}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all disabled:opacity-50 disabled:bg-gray-100"
                    >
                        <option value="">Tất cả trạng thái hàng</option>
                        <option value="true">Đang bán</option>
                        <option value="false">Hết hàng</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                ) : data?.metadata?.data?.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        Chưa có món ăn nào trong hệ thống của Thương hiệu.
                    </div>
                ) : (
                    <div className="flex flex-col w-full">
                        {data?.metadata?.data?.map((item: any) => (
                            <MenuItemRow key={item.id} item={item} restaurantId={restaurantId} id_brand={id_brand} />
                        ))}
                    </div>
                )}
                
                {/* Pagination */}
                {data?.metadata?.meta && data.metadata.meta.total > 0 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <span className="text-sm text-gray-500">
                            Hiển thị {(page - 1) * limit + 1} đến {Math.min(page * limit, data.metadata.meta.total)} của {data.metadata.meta.total} kết quả
                        </span>
                        <div className="flex items-center gap-4">
                            <select 
                                value={limit} 
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white outline-none cursor-pointer hover:border-green-400 transition-colors focus:ring-2 focus:ring-green-500/20"
                            >
                                <option value={10}>10 dòng / trang</option>
                                <option value={20}>20 dòng / trang</option>
                                <option value={50}>50 dòng / trang</option>
                            </select>
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                >
                                    Trước
                                </button>
                                <button 
                                    onClick={() => setPage(p => Math.min(data.metadata.meta.totalPages, p + 1))}
                                    disabled={page === data.metadata.meta.totalPages || data.metadata.meta.totalPages === 0}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FadeIn>
    );
};

export default BranchMenuTab;
