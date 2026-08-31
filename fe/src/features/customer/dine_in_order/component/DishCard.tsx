import React, { useState } from 'react';
import { MdOutlineRestaurantMenu, MdAdd, MdRemove, MdEditNote, MdLocalFireDepartment, MdTune } from 'react-icons/md';
import { MenuItemData } from '../type/dine_in_order.type';

interface Props {
    item: MenuItemData;
    quantityInCart: number;
    currentNote?: string;
    onAddToCart: (item: MenuItemData) => void;
    onRemoveFromCart: (item: MenuItemData) => void;
    onOpenOptionModal: (item: MenuItemData) => void;
    onOpenNoteModal: (item: MenuItemData) => void;
}

export const DishCard: React.FC<Props> = ({
    item,
    quantityInCart,
    currentNote,
    onAddToCart,
    onRemoveFromCart,
    onOpenOptionModal,
    onOpenNoteModal
}) => {
    const [imageError, setImageError] = useState(false);

    const hasVariants = Boolean(item.variants && item.variants.length > 0);
    const hasModifiers = Boolean(item.modifierGroups && item.modifierGroups.length > 0);
    const hasOptions = hasVariants || hasModifiers;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image && !imageError ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            onError={() => setImageError(true)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-300">
                            <MdOutlineRestaurantMenu className="text-3xl" />
                        </div>
                    )}

                    {item.is_featured && (
                        <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                            HOT
                        </span>
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between gap-1">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                {item.name}
                            </h4>
                            {item.spice_level && item.spice_level > 0 ? (
                                <span className="flex items-center text-xs text-red-500 font-medium shrink-0" title={`Độ cay: ${item.spice_level}`}>
                                    <MdLocalFireDepartment className="text-sm" />
                                    {item.spice_level > 1 && `x${item.spice_level}`}
                                </span>
                            ) : null}
                        </div>

                        {item.description && (
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                                {item.description}
                            </p>
                        )}

                        {/* CHỈ HIỂN THỊ SIZE / KÍCH CỠ */}
                        {hasVariants && item.variants && item.variants.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 mt-2">
                                <span className="text-[11px] text-gray-500 font-medium">Size:</span>
                                {item.variants.map((v) => (
                                    <span
                                        key={v.id}
                                        className="text-[11px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md border border-indigo-100"
                                    >
                                        {v.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-sm sm:text-base font-bold text-indigo-600">
                            {hasVariants ? `Từ ${item.price?.toLocaleString('vi-VN')}đ` : `${item.price?.toLocaleString('vi-VN')}đ`}
                        </span>

                        {/* Note preview if any */}
                        {currentNote && (
                            <span 
                                onClick={() => onOpenNoteModal(item)}
                                className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md max-w-[120px] truncate cursor-pointer hover:bg-amber-100 transition-colors"
                                title={currentNote}
                            >
                                📝 {currentNote}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => hasOptions ? onOpenOptionModal(item) : onOpenNoteModal(item)}
                    className="text-xs text-gray-500 hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors"
                >
                    <MdEditNote className="text-base" /> {currentNote ? 'Sửa ghi chú' : 'Ghi chú'}
                </button>

                {quantityInCart > 0 && !hasOptions ? (
                    <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl p-1">
                        <button
                            type="button"
                            onClick={() => onRemoveFromCart(item)}
                            className="w-7 h-7 rounded-lg bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all shadow-xs"
                            title="Giảm 1"
                        >
                            <MdRemove className="text-sm font-bold" />
                        </button>
                        <span className="text-sm font-bold text-indigo-700 w-5 text-center">
                            {quantityInCart}
                        </span>
                        <button
                            type="button"
                            onClick={() => onAddToCart(item)}
                            className="w-7 h-7 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center transition-all shadow-xs"
                            title="Tăng 1"
                        >
                            <MdAdd className="text-sm font-bold" />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => hasOptions ? onOpenOptionModal(item) : onAddToCart(item)}
                        className={`py-1.5 px-3.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs ${
                            hasOptions && quantityInCart > 0
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                        }`}
                    >
                        {hasOptions ? <MdTune className="text-sm" /> : <MdAdd className="text-sm font-bold" />}
                        {hasOptions ? (quantityInCart > 0 ? `Đã chọn (${quantityInCart})` : 'Chọn món') : 'Thêm món'}
                    </button>
                )}
            </div>
        </div>
    );
};
