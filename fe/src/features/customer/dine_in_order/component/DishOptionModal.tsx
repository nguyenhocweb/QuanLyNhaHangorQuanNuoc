import React, { useState, useEffect } from 'react';
import { MdClose, MdAdd, MdRemove, MdShoppingCart, MdCheck } from 'react-icons/md';
import { MenuItemData, MenuItemVariant, ModifierOptionData, CartItem } from '../type/dine_in_order.type';

interface Props {
    item: MenuItemData | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (customizedItem: CartItem) => void;
}

const QUICK_NOTES = [
    'Ít đá',
    'Ít đường',
    'Không cay',
    'Không hành',
    'Không rau mùi',
    'Lên món trước',
    'Lên món sau cùng',
    'Mang thêm đá',
];

export const DishOptionModal: React.FC<Props> = ({
    item,
    isOpen,
    onClose,
    onAddToCart,
}) => {
    const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | null>(null);
    const [selectedModifiers, setSelectedModifiers] = useState<ModifierOptionData[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState('');

    useEffect(() => {
        if (item) {
            // Mặc định chọn variant đầu tiên nếu có
            if (item.variants && item.variants.length > 0) {
                setSelectedVariant(item.variants[0]);
            } else {
                setSelectedVariant(null);
            }
            setSelectedModifiers([]);
            setQuantity(1);
            setNote('');
        }
    }, [item, isOpen]);

    if (!isOpen || !item) return null;

    // Tính giá cơ sở
    const baseItemPrice = selectedVariant ? selectedVariant.price : item.price;
    // Tính phụ thu topping
    const modifiersTotalExtra = selectedModifiers.reduce((acc, mod) => acc + (mod.priceExtra || 0), 0);
    // Tổng đơn giá 1 phần
    const unitPrice = baseItemPrice + modifiersTotalExtra;
    // Tổng tiền
    const totalPrice = unitPrice * quantity;

    const handleToggleModifier = (modifier: ModifierOptionData, maxSelections?: number) => {
        const isSelected = selectedModifiers.some(m => m.id === modifier.id);
        if (isSelected) {
            setSelectedModifiers(prev => prev.filter(m => m.id !== modifier.id));
        } else {
            // Check max selections
            if (maxSelections && maxSelections > 0) {
                // If maxSelections === 1 (single choice in group), replace existing in group or add
                if (maxSelections === 1) {
                    setSelectedModifiers(prev => [...prev.filter(m => m.id !== modifier.id), modifier]);
                    return;
                }
            }
            setSelectedModifiers(prev => [...prev, modifier]);
        }
    };

    const handleAddQuickNote = (tag: string) => {
        if (note.includes(tag)) return;
        setNote(prev => prev ? `${prev}, ${tag}` : tag);
    };

    const handleConfirm = () => {
        // Tạo cartItemId độc nhất dựa trên item + variant + modifiers + note
        const modifierIds = selectedModifiers.map(m => m.id).sort().join('-');
        const variantId = selectedVariant?.id || 'default';
        const cartItemId = `${item.id}_${variantId}_${modifierIds}_${note.trim()}`;

        // Tên hiển thị
        let displayName = item.name;
        if (selectedVariant) {
            displayName += ` (${selectedVariant.name})`;
        }

        onAddToCart({
            cartItemId,
            menuItemId: item.id,
            name: displayName,
            unitPrice,
            quantity,
            selectedVariant,
            selectedModifiers,
            note: note.trim() || undefined,
            image: item.image,
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="min-w-0 flex-1 pr-2">
                        <h3 className="font-bold text-gray-900 text-base truncate">{item.name}</h3>
                        <p className="text-xs text-indigo-600 font-bold mt-0.5">
                            Giá từ: {item.price?.toLocaleString('vi-VN')}đ
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors shrink-0"
                    >
                        <MdClose className="text-lg" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto flex-1 space-y-5">
                    {/* Item Preview */}
                    {item.image && (
                        <div className="w-full h-36 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {item.description && (
                        <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                            {item.description}
                        </p>
                    )}

                    {/* Section 1: Chọn Kích Cỡ / Biến Thể (Variants) */}
                    {item.variants && item.variants.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    1. Chọn Kích Cỡ / Size <span className="text-red-500">*</span>
                                </h4>
                                <span className="text-[11px] text-gray-400 font-medium">Bắt buộc chọn 1</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {item.variants.map(variant => {
                                    const isSelected = selectedVariant?.id === variant.id;
                                    return (
                                        <button
                                            key={variant.id}
                                            type="button"
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`p-3 rounded-xl border text-left transition-all relative ${
                                                isSelected
                                                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/20'
                                                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold">{variant.name}</span>
                                                {isSelected && <MdCheck className="text-indigo-600 text-sm" />}
                                            </div>
                                            <p className="text-xs font-semibold text-indigo-600 mt-1">
                                                {variant.price?.toLocaleString('vi-VN')}đ
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Section 2: Topping & Tùy Chọn Đi Kèm (Modifier Groups) */}
                    {item.modifierGroups && item.modifierGroups.length > 0 && (
                        <div className="space-y-4">
                            {item.modifierGroups.map(group => (
                                <div key={group.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            {group.name}
                                        </h4>
                                        {group.maxSelections ? (
                                            <span className="text-[11px] text-gray-400 font-medium">
                                                (Tối đa {group.maxSelections})
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="space-y-1.5">
                                        {group.options.map(option => {
                                            const isSelected = selectedModifiers.some(m => m.id === option.id);
                                            return (
                                                <div
                                                    key={option.id}
                                                    onClick={() => handleToggleModifier(option, group.maxSelections)}
                                                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                                        isSelected
                                                            ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900'
                                                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 bg-white'
                                                        }`}>
                                                            {isSelected && <MdCheck className="text-xs" />}
                                                        </div>
                                                        <span className="text-xs font-medium">{option.name}</span>
                                                    </div>

                                                    <span className="text-xs font-semibold text-indigo-600">
                                                        {option.priceExtra > 0 ? `+${option.priceExtra.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Section 3: Ghi Chú Đặc Biệt Cho Món Ăn */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                            Ghi chú đặc biệt cho món ăn
                        </h4>
                        
                        <div className="flex flex-wrap gap-1.5">
                            {QUICK_NOTES.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => handleAddQuickNote(tag)}
                                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                                        note.includes(tag)
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    + {tag}
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ghi chú thêm (ví dụ: ăn nhạt, nhiều sốt, v.v.)..."
                            rows={2}
                            className="w-full text-xs rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-800"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3 sticky bottom-0">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shrink-0">
                        <button
                            type="button"
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            disabled={quantity <= 1}
                            className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center transition-all"
                        >
                            <MdRemove className="text-sm" />
                        </button>
                        <span className="text-sm font-bold text-gray-900 w-6 text-center">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => setQuantity(prev => prev + 1)}
                            className="w-8 h-8 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center transition-all"
                        >
                            <MdAdd className="text-sm" />
                        </button>
                    </div>

                    {/* Submit Add to Cart Button */}
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="flex-1 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-1.5">
                            <MdShoppingCart className="text-base" />
                            <span>Thêm vào giỏ</span>
                        </div>
                        <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
