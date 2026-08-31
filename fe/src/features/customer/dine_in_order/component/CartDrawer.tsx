import React from 'react';
import { MdShoppingCart, MdClose, MdDeleteOutline, MdAdd, MdRemove, MdRestaurant, MdEditNote } from 'react-icons/md';
import { CartItem, MenuItemData } from '../type/dine_in_order.type';

interface Props {
    cartItems: CartItem[];
    isOpen: boolean;
    isPending: boolean;
    onOpen: () => void;
    onClose: () => void;
    onIncreaseItem: (cartItemId: string) => void;
    onDecreaseItem: (cartItemId: string) => void;
    onClearCart: () => void;
    onOpenNoteModal: (item: MenuItemData) => void;
    onSubmitOrder: () => void;
}

export const CartDrawer: React.FC<Props> = ({
    cartItems,
    isOpen,
    isPending,
    onOpen,
    onClose,
    onIncreaseItem,
    onDecreaseItem,
    onClearCart,
    onOpenNoteModal,
    onSubmitOrder
}) => {
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

    if (totalCount === 0 && !isOpen) return null;

    return (
        <>
            {/* Floating Bottom Bar (Mobile & Desktop) */}
            {totalCount > 0 && !isOpen && (
                <div className="fixed bottom-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
                    <div className="w-full max-w-lg bg-gray-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-gray-800 flex items-center justify-between pointer-events-auto animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={onOpen}>
                            <div className="relative w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                                <MdShoppingCart className="text-xl" />
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-900">
                                    {totalCount}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Giỏ gọi món</p>
                                <p className="text-sm font-bold text-white">
                                    {totalAmount.toLocaleString('vi-VN')}đ
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onOpen}
                            className="py-2.5 px-5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                        >
                            <MdRestaurant className="text-base" /> Xem giỏ ({totalCount})
                        </button>
                    </div>
                </div>
            )}

            {/* Modal / Drawer Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Drawer Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <MdShoppingCart className="text-lg" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">Món đang chọn ({totalCount})</h3>
                                    <p className="text-xs text-gray-500">Kiểm tra lại món trước khi gửi yêu cầu gọi món</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onClearCart}
                                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Xóa toàn bộ giỏ"
                                >
                                    <MdDeleteOutline className="text-xl" />
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                                >
                                    <MdClose className="text-lg" />
                                </button>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="p-4 overflow-y-auto flex-1 space-y-3 divide-y divide-gray-50">
                            {cartItems.length === 0 ? (
                                <div className="py-12 text-center text-gray-400">
                                    <MdShoppingCart className="text-4xl mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">Chưa có món nào trong giỏ</p>
                                </div>
                            ) : (
                                cartItems.map(item => {
                                    const dummyMenuItem: MenuItemData = {
                                        id: item.menuItemId,
                                        name: item.name,
                                        price: item.unitPrice,
                                    };

                                    return (
                                        <div key={item.cartItemId} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                                                
                                                {/* Selected Modifiers / Toppings */}
                                                {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                                                    <p className="text-[11px] text-indigo-700 font-medium mt-0.5">
                                                        + {item.selectedModifiers.map(m => `${m.name} (${m.priceExtra > 0 ? `+${m.priceExtra.toLocaleString('vi-VN')}đ` : '0đ'})`).join(', ')}
                                                    </p>
                                                )}

                                                <p className="text-xs font-bold text-indigo-600 mt-1">
                                                    {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ
                                                </p>
                                                
                                                {/* Note */}
                                                {item.note ? (
                                                    <p 
                                                        onClick={() => onOpenNoteModal(dummyMenuItem)}
                                                        className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded mt-1 inline-block cursor-pointer hover:bg-amber-100 transition-colors"
                                                        title="Bấm để chỉnh sửa ghi chú"
                                                    >
                                                        📝 Ghi chú: {item.note}
                                                    </p>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => onOpenNoteModal(dummyMenuItem)}
                                                        className="mt-1 text-[11px] text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                                                    >
                                                        <MdEditNote className="text-sm" />
                                                        <span>+ Thêm ghi chú</span>
                                                    </button>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => onDecreaseItem(item.cartItemId)}
                                                    className="w-7 h-7 rounded-lg bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-all shadow-xs"
                                                >
                                                    <MdRemove className="text-sm" />
                                                </button>
                                                <span className="text-sm font-bold text-gray-800 w-5 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => onIncreaseItem(item.cartItemId)}
                                                    className="w-7 h-7 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center transition-all shadow-xs"
                                                >
                                                    <MdAdd className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Drawer Footer & Submit */}
                        {cartItems.length > 0 && (
                            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">Tổng cộng ({totalCount} món):</span>
                                    <span className="text-lg font-bold text-indigo-700">
                                        {totalAmount.toLocaleString('vi-VN')}đ
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={onSubmitOrder}
                                    disabled={isPending}
                                    className="w-full py-3 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <MdRestaurant className="text-lg" />
                                    {isPending ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu gọi món'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
