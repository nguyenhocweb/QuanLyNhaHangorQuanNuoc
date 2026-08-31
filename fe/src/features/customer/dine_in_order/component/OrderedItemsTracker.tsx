import React, { useState } from 'react';
import { 
    MdCheckCircle, 
    MdHourglassEmpty, 
    MdOutdoorGrill, 
    MdOutlineRoomService, 
    MdCancel, 
    MdReceiptLong, 
    MdAdd, 
    MdConfirmationNumber, 
    MdClose, 
    MdPayment, 
    MdNotificationsActive,
    MdRoomService,
    MdReceipt
} from 'react-icons/md';
import { toast } from 'sonner';
import { ActiveOrderData, KitchenStatus, EffectiveTaxConfig } from '../type/dine_in_order.type';
import { VoucherSelectModal } from './VoucherSelectModal';
import { OnlinePaymentModal } from './OnlinePaymentModal';
import { Promotion } from '../../promotions/type/promotion.type';

interface Props {
    order: ActiveOrderData | null;
    isLoading: boolean;
    taxConfig?: EffectiveTaxConfig;
    paymentConfigs?: any[];
    onSwitchToMenu: () => void;
}

const getKitchenStatusBadge = (status: KitchenStatus) => {
    switch (status) {
        case 'QUEUED':
            return {
                text: 'Đang tiếp nhận',
                icon: MdHourglassEmpty,
                color: 'bg-amber-50 text-amber-700 border-amber-200'
            };
        case 'PREPARING':
            return {
                text: 'Đang chế biến',
                icon: MdOutdoorGrill,
                color: 'bg-blue-50 text-blue-700 border-blue-200'
            };
        case 'READY':
            return {
                text: 'Món đã sẵn sàng',
                icon: MdCheckCircle,
                color: 'bg-purple-50 text-purple-700 border-purple-200'
            };
        case 'SERVING':
            return {
                text: 'Đang mang ra bàn',
                icon: MdOutlineRoomService,
                color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
            };
        case 'SERVED':
            return {
                text: 'Đã lên bàn',
                icon: MdCheckCircle,
                color: 'bg-green-50 text-green-700 border-green-200'
            };
        case 'CANCELLED':
            return {
                text: 'Đã hủy món',
                icon: MdCancel,
                color: 'bg-red-50 text-red-700 border-red-200'
            };
        default:
            return {
                text: status,
                icon: MdHourglassEmpty,
                color: 'bg-gray-50 text-gray-700 border-gray-200'
            };
    }
};

export const OrderedItemsTracker: React.FC<Props> = ({
    order,
    isLoading,
    taxConfig,
    paymentConfigs,
    onSwitchToMenu
}) => {
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
    const [isOnlinePaymentModalOpen, setIsOnlinePaymentModalOpen] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState<Promotion | null>(null);

    if (isLoading) {
        return (
            <div className="py-16 text-center text-gray-400">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm">Đang tải danh sách món đã gọi...</p>
            </div>
        );
    }

    if (!order || !order.items || order.items.length === 0) {
        return (
            <div className="max-w-md mx-auto py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                    <MdReceiptLong className="text-3xl" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Chưa có món nào được gọi</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">
                    Bàn của bạn hiện chưa gửi yêu cầu gọi món nào.
                </p>
                <button
                    type="button"
                    onClick={onSwitchToMenu}
                    className="py-2.5 px-6 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                    Xem thực đơn & Gọi món ngay
                </button>
            </div>
        );
    }

    // 1. Tạm tính tiền món ăn
    const subtotal = order.subtotal || order.items.reduce((acc, i) => acc + (i.totalPrice || (i.unitPrice * i.quantity)), 0);

    // 2. Tính toán Giảm giá từ Voucher
    let calculatedDiscount = order.discount_amount || 0;
    if (appliedVoucher) {
        const discountType = appliedVoucher.discountType || (appliedVoucher as any).discount_type;
        const discountValue = appliedVoucher.discountValue ?? (appliedVoucher as any).discount_value ?? 0;
        const maxDiscount = appliedVoucher.maxDiscount ?? (appliedVoucher as any).max_discount;

        if (discountType === 'PERCENTAGE') {
            calculatedDiscount = (subtotal * discountValue) / 100;
            if (maxDiscount && calculatedDiscount > maxDiscount) {
                calculatedDiscount = maxDiscount;
            }
        } else {
            calculatedDiscount = discountValue;
        }
    }

    // 3. Tính Phí phục vụ (Kế thừa: Brand -> Restaurant)
    const hasServiceCharge = Boolean(taxConfig?.applyServiceCharge && taxConfig.serviceChargeRate > 0);
    const serviceFee = hasServiceCharge ? (subtotal * (taxConfig!.serviceChargeRate / 100)) : 0;

    // 4. Tính Thuế VAT (Kế thừa: Brand -> Restaurant)
    let vatAmount = order.tax_amount || 0;
    const isVatInclusive = taxConfig?.isVatInclusive || false;
    const vatRate = taxConfig?.defaultVatRate || 0;

    if (!isVatInclusive && vatRate > 0) {
        const taxableAmount = Math.max(0, subtotal + serviceFee - calculatedDiscount);
        vatAmount = (taxableAmount * vatRate) / 100;
    }

    // 5. Tổng thanh toán cuối cùng
    const finalTotal = Math.max(0, subtotal + serviceFee + vatAmount - calculatedDiscount);

    const handleApplyVoucher = (voucher: Promotion) => {
        setAppliedVoucher(voucher);
        toast.success(`Đã áp dụng mã giảm giá "${voucher.code}" thành công!`);
    };

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null);
        toast.info("Đã hủy áp dụng mã giảm giá");
    };

    const handleCallWaiter = () => {
        toast.success("Đã gửi yêu cầu nhân viên hỗ trợ thanh toán tại bàn!");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-4 pb-12">
            {/* Top Card: Order Info (Không để tổng tiền ở đây) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">MÃ ĐƠN GỌI MÓN</span>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">#{order.order_number}</h3>
                        {order.createdAt && (
                            <p className="text-xs text-gray-400 mt-0.5">
                                Thời gian: {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • Bàn {order.table?.table_number || 'dùng bữa'}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onSwitchToMenu}
                        className="py-2 px-4 text-xs sm:text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                        <MdAdd className="text-base" /> Gọi thêm món
                    </button>
                </div>
            </div>

            {/* Middle Card: Ordered Items List */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                        Danh sách món đã gọi ({order.items.length})
                    </h4>
                    <span className="text-xs text-gray-500">Tự động cập nhật</span>
                </div>

                <div className="divide-y divide-gray-50 space-y-3">
                    {order.items.map((item) => {
                        const statusBadge = getKitchenStatusBadge(item.status);
                        const StatusIcon = statusBadge.icon;

                        return (
                            <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                                            {item.quantity}x
                                        </span>
                                        <h5 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h5>
                                    </div>

                                    {item.note && (
                                        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded mt-1 inline-block">
                                            📝 {item.note}
                                        </p>
                                    )}

                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {item.totalPrice?.toLocaleString('vi-VN')}đ
                                    </p>
                                </div>

                                {/* Status badge */}
                                <div className="shrink-0 flex items-center gap-1.5">
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl border flex items-center gap-1 shadow-2xs ${statusBadge.color}`}>
                                        <StatusIcon className="text-sm" />
                                        {statusBadge.text}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Card 3: Mã Giảm Giá / Voucher */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <MdConfirmationNumber className="text-base" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900">Mã giảm giá / Voucher</span>
                    </div>

                    {appliedVoucher && (
                        <button
                            type="button"
                            onClick={() => setIsVoucherModalOpen(true)}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                            Đổi mã khác
                        </button>
                    )}
                </div>

                {appliedVoucher ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between gap-3 animate-in fade-in">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                %
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-green-900 uppercase">{appliedVoucher.code}</p>
                                <p className="text-[11px] text-green-700 truncate">
                                    Đã giảm: -{calculatedDiscount.toLocaleString('vi-VN')}đ
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleRemoveVoucher}
                            className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 text-green-800 flex items-center justify-center transition-colors shrink-0"
                            title="Hủy mã giảm giá"
                        >
                            <MdClose className="text-sm" />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsVoucherModalOpen(true)}
                        className="w-full py-3 px-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-700 font-bold text-xs sm:text-sm flex items-center justify-between transition-all"
                    >
                        <div className="flex items-center gap-2">
                            <MdConfirmationNumber className="text-base text-indigo-600" />
                            <span>Chọn hoặc nhập mã giảm giá</span>
                        </div>
                        <span className="text-xs font-semibold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-100 shadow-2xs">
                            Chọn voucher &gt;
                        </span>
                    </button>
                )}
            </div>

            {/* Bottom Card: Chi Tiết Thanh Toán & TỔNG TIỀN Ở DƯỚI CÙNG */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                        <MdReceipt className="text-indigo-600 text-lg" /> Chi tiết thanh toán
                    </h4>
                    {taxConfig?.source && taxConfig.source !== 'NONE' && (
                        <span className="text-[10px] text-gray-400 font-medium">
                            Áp dụng biểu phí: {taxConfig.source === 'BRAND' ? 'Thương hiệu' : 'Nhà hàng'}
                        </span>
                    )}
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm">
                    {/* 1. Tạm tính */}
                    <div className="flex items-center justify-between text-gray-600">
                        <span>Tạm tính ({order.items.length} món):</span>
                        <span className="font-semibold text-gray-900">{subtotal.toLocaleString('vi-VN')}đ</span>
                    </div>

                    {/* 2. Phí phục vụ (nếu có cấu hình) */}
                    {hasServiceCharge && (
                        <div className="flex items-center justify-between text-gray-600">
                            <span className="flex items-center gap-1">
                                <MdRoomService className="text-sm text-indigo-600" /> Phí phục vụ ({taxConfig?.serviceChargeRate}%):
                            </span>
                            <span className="font-semibold text-gray-900">+{serviceFee.toLocaleString('vi-VN')}đ</span>
                        </div>
                    )}

                    {/* 3. Thuế VAT */}
                    {vatRate > 0 && (
                        <div className="flex items-center justify-between text-gray-600">
                            <span>Thuế VAT ({vatRate}%){isVatInclusive ? ' (Đã gồm trong giá)' : ''}:</span>
                            <span className="font-semibold text-gray-900">
                                {isVatInclusive ? 'Đã bao gồm' : `+${vatAmount.toLocaleString('vi-VN')}đ`}
                            </span>
                        </div>
                    )}

                    {/* 4. Giảm giá Voucher */}
                    {calculatedDiscount > 0 && (
                        <div className="flex items-center justify-between text-green-600 font-medium">
                            <span className="flex items-center gap-1">
                                <MdConfirmationNumber className="text-sm" /> Giảm giá voucher ({appliedVoucher?.code}):
                            </span>
                            <span className="font-bold">-{calculatedDiscount.toLocaleString('vi-VN')}đ</span>
                        </div>
                    )}

                    {/* Dòng phân cách tổng */}
                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">TỔNG CỘNG THANH TOÁN</span>
                            <span className="text-[11px] text-gray-400">Đã bao gồm thuế, phí & ưu đãi</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xl sm:text-2xl font-black text-indigo-600">
                                {finalTotal.toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2 Nút hành động thanh toán */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                    {/* Nút 1: Thanh toán Online */}
                    <button
                        type="button"
                        onClick={() => setIsOnlinePaymentModalOpen(true)}
                        className="w-full sm:flex-1 py-3.5 px-4 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <MdPayment className="text-lg" />
                        <span>Thanh toán Online (QR / Ví)</span>
                    </button>

                    {/* Nút 2: Gọi nhân viên đến thanh toán */}
                    <button
                        type="button"
                        onClick={handleCallWaiter}
                        className="w-full sm:flex-1 py-3.5 px-4 text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2"
                    >
                        <MdNotificationsActive className="text-lg text-indigo-600" />
                        <span>Gọi nhân viên đến thanh toán</span>
                    </button>
                </div>
            </div>

            {/* Note & Guidelines */}
            <div className="bg-blue-50/60 rounded-2xl border border-blue-100 p-4 text-xs text-blue-800 leading-relaxed">
                💡 <strong>Lưu ý:</strong> Trạng thái món ăn được cập nhật theo thời gian thực. Bạn có thể tự quét mã thanh toán trực tuyến hoặc bấm gọi nhân viên phục vụ mang máy POS / tiền thối lại bàn.
            </div>

            {/* Modal Chọn Voucher */}
            <VoucherSelectModal
                isOpen={isVoucherModalOpen}
                onClose={() => setIsVoucherModalOpen(false)}
                subtotal={subtotal}
                appliedVoucher={appliedVoucher}
                onApplyVoucher={handleApplyVoucher}
                onRemoveVoucher={handleRemoveVoucher}
            />

            {/* Modal Thanh toán Online */}
            <OnlinePaymentModal
                isOpen={isOnlinePaymentModalOpen}
                onClose={() => setIsOnlinePaymentModalOpen(false)}
                orderNumber={order.order_number}
                finalTotal={finalTotal}
                restaurantName={order.restaurant?.name || 'Nhà hàng'}
                tableNumber={order.table?.table_number}
                paymentConfigs={paymentConfigs}
            />
        </div>
    );
};
