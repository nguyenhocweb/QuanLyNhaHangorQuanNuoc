import React, { useState } from 'react';
import { 
    MdClose, 
    MdQrCode2, 
    MdPayment, 
    MdContentCopy, 
    MdCheckCircle, 
    MdAccountBalance, 
    MdOutlineSmartphone 
} from 'react-icons/md';
import { toast } from 'sonner';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    orderNumber: string;
    finalTotal: number;
    restaurantName?: string;
    tableNumber?: string;
    paymentConfigs?: any[];
}

type PaymentTab = 'VIETQR' | 'MOMO' | 'VNPAY';

export const OnlinePaymentModal: React.FC<Props> = ({
    isOpen,
    onClose,
    orderNumber,
    finalTotal,
    restaurantName = 'Nhà hàng',
    tableNumber,
    paymentConfigs = []
}) => {
    const [activeTab, setActiveTab] = useState<PaymentTab>('VIETQR');
    const [isPaidConfirming, setIsPaidConfirming] = useState(false);

    if (!isOpen) return null;

    // Tìm cấu hình VietQR / Ngân hàng của Brand hoặc Nhà hàng
    const bankConfigItem = paymentConfigs.find(
        (c: any) => c.systemPaymentMethod?.code === 'BANK_TRANSFER' || c.systemPaymentMethod?.code === 'VIETQR'
    );
    const bankData = bankConfigItem?.configData || {};

    const bankCode = bankData.bankCode || '970436';
    const bankName = bankData.bankName || 'Vietcombank';
    const accountNumber = bankData.accountNumber || '1025588668';
    const accountHolder = bankData.accountHolder || restaurantName;

    // Tạo nội dung chuyển khoản chuẩn
    const transferContent = `THANHTOAN ${orderNumber}`;
    // Link VietQR động chuẩn Napas
    const vietQrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${finalTotal}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountHolder.toUpperCase())}`;

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Đã sao chép ${label}!`);
    };

    const handleConfirmPaid = () => {
        setIsPaidConfirming(true);
        setTimeout(() => {
            setIsPaidConfirming(false);
            toast.success("Đã ghi nhận yêu cầu thanh toán online! Hệ thống đang kiểm tra đối soát giao dịch.");
            onClose();
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-0 sm:p-4">
            <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <MdPayment className="text-lg" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-base">Thanh toán trực tuyến</h3>
                            <p className="text-xs text-gray-500">
                                Đơn #{orderNumber} {tableNumber ? `• Bàn ${tableNumber}` : ''}
                            </p>
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
                <div className="p-5 overflow-y-auto flex-1 space-y-4">
                    {/* Method Selector Tabs */}
                    <div className="grid grid-cols-3 gap-2 bg-gray-100/80 p-1 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setActiveTab('VIETQR')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                activeTab === 'VIETQR'
                                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-gray-200'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <MdQrCode2 className="text-base" /> VietQR / CK
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('MOMO')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                activeTab === 'MOMO'
                                    ? 'bg-white text-[#A50064] shadow-sm ring-1 ring-gray-200'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <MdOutlineSmartphone className="text-base" /> Ví MoMo
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('VNPAY')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                activeTab === 'VNPAY'
                                    ? 'bg-white text-[#005BAA] shadow-sm ring-1 ring-gray-200'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <MdAccountBalance className="text-base" /> VNPAY-QR
                        </button>
                    </div>

                    {/* QR Payment View */}
                    <div className="bg-gray-50/80 rounded-2xl border border-gray-100 p-4 flex flex-col items-center text-center space-y-3">
                        <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs">
                            <img
                                src={vietQrUrl}
                                alt="Mã QR thanh toán"
                                className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
                            />
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 font-medium">SỐ TIỀN CẦN THANH TOÁN</span>
                            <p className="text-2xl font-black text-indigo-600">
                                {finalTotal.toLocaleString('vi-VN')}đ
                            </p>
                        </div>
                    </div>

                    {/* Transfer Details Card */}
                    <div className="bg-white rounded-xl border border-gray-200/70 p-3.5 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Ngân hàng:</span>
                            <span className="font-bold text-gray-900">{bankName}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Số tài khoản:</span>
                            <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                    {accountNumber}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(accountNumber, 'số tài khoản')}
                                    className="text-gray-400 hover:text-indigo-600 p-1"
                                    title="Sao chép số tài khoản"
                                >
                                    <MdContentCopy className="text-sm" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Chủ tài khoản:</span>
                            <span className="font-bold text-gray-900 uppercase">{accountHolder}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Nội dung chuyển khoản:</span>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                    {transferContent}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(transferContent, 'nội dung chuyển khoản')}
                                    className="text-gray-400 hover:text-indigo-600 p-1"
                                    title="Sao chép nội dung"
                                >
                                    <MdContentCopy className="text-sm" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Số tiền:</span>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-900">
                                    {finalTotal.toLocaleString('vi-VN')}đ
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(finalTotal.toString(), 'số tiền')}
                                    className="text-gray-400 hover:text-indigo-600 p-1"
                                    title="Sao chép số tiền"
                                >
                                    <MdContentCopy className="text-sm" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2 sticky bottom-0">
                    <button
                        type="button"
                        onClick={handleConfirmPaid}
                        disabled={isPaidConfirming}
                        className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <MdCheckCircle className="text-lg" />
                        <span>{isPaidConfirming ? 'Đang xác nhận...' : 'Tôi đã hoàn tất chuyển khoản'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
