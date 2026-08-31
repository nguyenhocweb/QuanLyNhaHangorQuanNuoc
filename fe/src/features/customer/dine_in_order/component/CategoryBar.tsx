import React from 'react';
import { MenuCategoryData } from '../type/dine_in_order.type';
import { MdOutlineRestaurantMenu } from 'react-icons/md';

interface MenuOption {
    id: string;
    name: string;
}

interface Props {
    menus: MenuOption[];
    selectedMenuId: string;
    onSelectMenu: (menuId: string) => void;
    categories: MenuCategoryData[];
    activeCategoryId: string;
    onSelectCategory: (categoryId: string) => void;
}

export const CategoryBar: React.FC<Props> = ({
    menus,
    selectedMenuId,
    onSelectMenu,
    categories,
    activeCategoryId,
    onSelectCategory
}) => {
    const totalItems = categories.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);

    return (
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
            <div className="max-w-5xl mx-auto px-4 py-3 space-y-3">
                {/* Row 1: Chọn Thực Đơn (Chỉ hiển thị khi có từ 1 thực đơn trở lên) */}
                {menus.length > 0 && (
                    <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                            <MdOutlineRestaurantMenu className="text-base text-indigo-600" /> Thực đơn:
                        </span>
                        
                        {menus.length > 1 ? (
                            <div className="relative max-w-xs sm:max-w-sm">
                                <select
                                    value={selectedMenuId}
                                    onChange={(e) => onSelectMenu(e.target.value)}
                                    className="w-full text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50/70 border border-indigo-200 rounded-xl px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs transition-all"
                                >
                                    {menus.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <span className="text-xs sm:text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200/60">
                                {menus[0]?.name}
                            </span>
                        )}
                    </div>
                )}

                {/* Row 2: Thanh Trượt Danh Mục (Pills) */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                    <button
                        type="button"
                        onClick={() => onSelectCategory('ALL')}
                        className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            activeCategoryId === 'ALL'
                                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/20'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Tất cả ({totalItems})
                    </button>

                    {categories.map(cat => {
                        const isActive = activeCategoryId === cat.id;
                        const count = cat.items?.length || 0;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => onSelectCategory(cat.id)}
                                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                    isActive
                                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/20'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span>{cat.name}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    isActive ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
