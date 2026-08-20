import React, { useEffect, useState } from 'react';
import { FiX, FiCheckCircle, FiAlertTriangle, FiLoader } from 'react-icons/fi';
import { useVerifyPaymentConfig } from '../hook/useVerifyPaymentConfig';
import { useSocket } from '@/src/core/hooks/useSocket';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
    systemPaymentMethodId: string;
    providerCode: string;
    isOpen: boolean;
    onClose: () => void;
}

export const PaymentVerificationModal: React.FC<Props> = ({ systemPaymentMethodId, providerCode, isOpen, onClose }) => {
    const { mutate: verify, isPending } = useVerifyPaymentConfig();
    const [qrData, setQrData] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isOpen) {
            handleCreateVerify();
        } else {
            // reset state
            setQrData(null);
            setTimeLeft(60);
            setIsSuccess(false);
            setIsExpired(false);
            setErrorMsg(null);
        }
    }, [isOpen]);

    // WebSocket listener
    useEffect(() => {
        if (!socket || !isOpen) return;

        const handleVerificationSuccess = (data: any) => {
            if (data.systemPaymentMethodId === systemPaymentMethodId) {
                setIsSuccess(true);
                // Refetch config to update the status in UI
                queryClient.invalidateQueries({ queryKey: ["adminPaymentConfig", systemPaymentMethodId] });
            }
        };

        socket.on('payment_verification_success', handleVerificationSuccess);

        return () => {
            socket.off('payment_verification_success', handleVerificationSuccess);
        };
    }, [socket, isOpen, systemPaymentMethodId, queryClient]);

    // Countdown Timer
    useEffect(() => {
        if (qrData && timeLeft > 0 && !isSuccess) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
        if (timeLeft === 0 && !isSuccess) {
            setIsExpired(true);
        }
    }, [qrData, timeLeft, isSuccess]);

    const handleCreateVerify = () => {
        setQrData(null);
        setTimeLeft(60);
        setIsSuccess(false);
        setIsExpired(false);
        setErrorMsg(null);
        verify(systemPaymentMethodId, {
            onSuccess: (data: any) => {
                if (data.status === 'VERIFIED') {
                    setIsSuccess(true); // Auto verified (CASH, BANK)
                } else {
                    setQrData(data); // Has QR Code
                }
            },
            onError: (err: any) => {
                setErrorMsg(err?.response?.data?.message || err.message || "Lỗi cấu hình hoặc cổng thanh toán không phản hồi.");
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <FiX size={20} />
                </button>

                <h3 className="text-xl font-bold text-gray-900 mb-2">Kiểm định cổng thanh toán</h3>
                
                {isPending ? (
                    <div className="py-10 flex flex-col items-center">
                        <FiLoader className="animate-spin text-indigo-600 mb-4" size={40} />
                        <p className="text-gray-500">Đang khởi tạo giao dịch 1.000đ...</p>
                    </div>
                ) : isSuccess ? (
                    <div className="py-8 flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <FiCheckCircle size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Kiểm định thành công!</h4>
                        <p className="text-sm text-gray-500 mt-2">Hệ thống đã nhận được tiền test và xác thực API cấu hình chính xác.</p>
                        <button 
                            onClick={onClose}
                            className="mt-6 w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Đóng và Kích hoạt
                        </button>
                    </div>
                ) : errorMsg ? (
                    <div className="py-8 flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                            <FiAlertTriangle size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Lỗi cấu hình!</h4>
                        <p className="text-sm text-gray-500 mt-2 px-4 whitespace-pre-wrap">{errorMsg}</p>
                        <button 
                            onClick={onClose}
                            className="mt-6 w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            Quay lại sửa cấu hình
                        </button>
                    </div>
                ) : isExpired ? (
                    <div className="py-8 flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                            <FiAlertTriangle size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Mã QR đã hết hạn!</h4>
                        <p className="text-sm text-gray-500 mt-2">Bạn đã không thanh toán trong thời gian 60 giây.</p>
                        <button 
                            onClick={handleCreateVerify}
                            className="mt-6 w-full py-2.5 border border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
                        >
                            Tạo lại mã kiểm định
                        </button>
                    </div>
                ) : qrData ? (
                    <div className="py-4 flex flex-col items-center w-full">
                        <p className="text-sm text-gray-600 mb-4">
                            Vui lòng dùng ứng dụng ngân hàng quét mã dưới đây để chuyển <span className="font-bold text-indigo-600">1.000 VNĐ</span>.
                        </p>
                        
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4 w-full flex justify-center">
                            {qrData.qrCodeUrl ? (
                                <img src={qrData.qrCodeUrl} alt="QR Code" className="w-48 h-48 object-contain" />
                            ) : (
                                <div className="w-48 h-48 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                                    Không có QR Code
                                </div>
                            )}
                        </div>

                        <div className="w-full flex items-center justify-between text-sm px-2">
                            <span className="text-gray-500">Mã đơn test:</span>
                            <span className="font-mono font-medium text-gray-900">{qrData.testOrderCode}</span>
                        </div>
                        
                        <div className="w-full flex justify-center mt-6">
                            <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-full text-sm font-medium border border-orange-200">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                </span>
                                Đang chờ thanh toán ({timeLeft}s)
                            </div>
                        </div>
                        
                        {qrData.checkoutUrl && (
                            <a href={qrData.checkoutUrl} target="_blank" rel="noreferrer" className="mt-4 text-xs text-indigo-600 hover:underline block">
                                Mở trang thanh toán
                            </a>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};
