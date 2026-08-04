import React, { useState } from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';
import { CustomerReservation } from '../type/reservation.type';
import { useCancelMyReservation } from '../hook/useCancelMyReservation';

interface CancelModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: CustomerReservation | null;
}

export const CancelReservationModal = ({ isOpen, onClose, reservation }: CancelModalProps) => {
    const [reason, setReason] = useState("");
    const cancelMutation = useCancelMyReservation();

    if (!isOpen || !reservation) return null;

    const handleConfirm = async () => {
        if (!reason.trim()) {
            return;
        }
        await cancelMutation.mutateAsync({ id: reservation.id, reason });
        onClose();
        setReason("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <FiX className="text-xl" />
                </button>
                
                <div className="p-6 text-center space-y-4">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        <FiAlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Xác nhận hủy đặt bàn</h3>
                    <p className="text-sm text-gray-500">
                        Bạn đang chuẩn bị hủy bàn tại <strong>{reservation.restaurant?.name}</strong> vào lúc {reservation.start_time} ngày {new Date(reservation.reservation_date).toLocaleDateString('vi-VN')}.
                    </p>
                    
                    <div className="text-left mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lý do hủy bàn <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm transition-all resize-none h-24"
                            placeholder="Vui lòng cho nhà hàng biết lý do bạn hủy..."
                        />
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={cancelMutation.isPending || !reason.trim()}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {cancelMutation.isPending ? "Đang xử lý..." : "Xác nhận Hủy"}
                    </button>
                </div>
            </div>
        </div>
    );
};
