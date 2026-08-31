import React, { useState } from 'react';
import { MdClose, MdConfirmationNumber, MdCheck, MdLocalOffer } from 'react-icons/md';
import { useGetMyVoucherWallet } from '../../promotions/hook/useGetMyVoucherWallet';
import { Promotion } from '../../promotions/type/promotion.type';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    subtotal: number;
    appliedVoucher: Promotion | null;
    onApplyVoucher: (voucher: Promotion) => void;
    onRemoveVoucher: () => void;
}

export const VoucherSelectModal: React.FC<Props> = ({
    isOpen,
    onClose,
    subtotal,
    appliedVoucher,
    onApplyVoucher,
    onRemoveVoucher
}) => {
    const [inputCode, setInputCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { data: walletData, isLoading } = useGetMyVoucherWallet({ limit: 50, status: 'ACTIVE' });
    const walletItems = walletData?.metadata?.items || [];

    if (!isOpen) return null;

    const handleApplyFromInput = () => {
        setErrorMessage('');
        const trimmed = inputCode.trim().toUpperCase();
        if (!trimmed) {
            setErrorMessage('Vui lòng nhập mã giảm giá');
            return;
        }

        // Tìm trong ví hoặc tạo promotion tạm thời
        const found = walletItems.find(item => item.promotion.code.toUpperCase() === trimmed);
        if (found) {
            handleSelectVoucher(found.promotion);
        } else {
            // Check nếu có mã đặc biệt hoặc báo lỗi
            setErrorMessage(`Không tìm thấy mã giảm giá "${trimmed}" hợp lệ`);
        }
    };

    const handleSelectVoucher = (voucher: Promotion) => {
        setErrorMessage('');
        const minOrder = voucher.minOrderValue || (voucher as any).min_order_value || 0;
        if (subtotal < minOrder) {
            setErrorMessage(`Đơn hàng tối thiểu ${minOrder.toLocaleString('vi-VN')}đ mới có thể dùng mã này (Hiện tại: ${subtotal.toLocaleString('vi-VN')}đ)`);
            return;
        }

        onApplyVoucher(voucher);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <MdConfirmationNumber className="text-lg" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-base">Chọn mã giảm giá</h3>
                            <p className="text-xs text-gray-500">Áp dụng voucher ưu đãi cho đơn gọi món</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                    >
                        <MdClose className="text-lg" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto flex-1 space-y-4">
                    {/* Manual input */}
                    <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1.5">Nhập mã ưu đãi:</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                placeholder="Nhập mã voucher (ví dụ: GIAM20K)"
                                className="flex-1 uppercase font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                            />
                            <button
                                type="button"
                                onClick={handleApplyFromInput}
                                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                            >
                                Áp dụng
                            </button>
                        </div>
                        {errorMessage && (
                            <p className="text-xs text-red-500 font-medium mt-1.5">{errorMessage}</p>
                        )}
                    </div>

                    {/* Voucher List */}
                    <div className="space-y-2.5 pt-2">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                            <MdLocalOffer className="text-indigo-600 text-sm" /> Mã giảm giá trong ví của bạn:
                        </h4>

                        {isLoading ? (
                            <div className="py-8 text-center text-gray-400">
                                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                <p className="text-xs">Đang tải mã giảm giá...</p>
                            </div>
                        ) : walletItems.length === 0 ? (
                            <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-4">
                                <MdConfirmationNumber className="text-3xl text-gray-300 mx-auto mb-1" />
                                <p className="text-xs text-gray-500">Chưa có mã giảm giá nào trong ví</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {walletItems.map(item => {
                                    const voucher = item.promotion;
                                    const isSelected = appliedVoucher?.id === voucher.id;
                                    const minOrder = voucher.minOrderValue || (voucher as any).min_order_value || 0;
                                    const isEligible = subtotal >= minOrder;

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => isEligible && handleSelectVoucher(voucher)}
                                            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                                !isEligible
                                                    ? 'opacity-60 bg-gray-50 border-gray-200 cursor-not-allowed'
                                                    : isSelected
                                                        ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 cursor-pointer'
                                                        : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-xs cursor-pointer'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                                                    isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
                                                }`}>
                                                    %
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-xs font-bold text-gray-900 uppercase">
                                                            {voucher.code}
                                                        </span>
                                                        {isSelected && (
                                                            <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded">
                                                                Đang dùng
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                                        {voucher.description || (voucher.discountType === 'PERCENTAGE' ? `Giảm ${voucher.discountValue}%` : `Giảm ${voucher.discountValue.toLocaleString('vi-VN')}đ`)}
                                                    </p>
                                                    {minOrder > 0 && (
                                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                                            Đơn tối thiểu: {minOrder.toLocaleString('vi-VN')}đ
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="shrink-0">
                                                {isSelected ? (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onRemoveVoucher();
                                                        }}
                                                        className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-xl transition-colors"
                                                    >
                                                        Bỏ chọn
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={!isEligible}
                                                        className="text-xs font-bold text-indigo-600 hover:text-white hover:bg-indigo-600 bg-indigo-50 disabled:opacity-40 px-3 py-1.5 rounded-xl transition-all"
                                                    >
                                                        Áp dụng
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
