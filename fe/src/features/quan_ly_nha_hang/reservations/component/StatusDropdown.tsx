import React from 'react';
import { Reservation, ReservationStatus } from "../type/reservation.type";
import { useUpdateReservationStatus } from "../hook/useUpdateReservationStatus";

const statusOptions = [
    { value: "PENDING", label: "Chờ xác nhận", color: "text-yellow-600 bg-yellow-50" },
    { value: "CONFIRMED", label: "Đã xác nhận", color: "text-blue-600 bg-blue-50" },
    { value: "COMPLETED", label: "Hoàn thành", color: "text-green-600 bg-green-50" },
    { value: "CANCELLED", label: "Đã huỷ", color: "text-red-600 bg-red-50" },
    { value: "NO_SHOW", label: "Khách không đến", color: "text-orange-600 bg-orange-50" }
];

export const StatusDropdown = ({ reservation, restaurantId }: { reservation: Reservation, restaurantId: string }) => {
    const { mutate: updateStatus, isPending } = useUpdateReservationStatus(restaurantId);

    const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
    const [cancelReason, setCancelReason] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as ReservationStatus;
        if (newStatus === reservation.status) return;

        if (newStatus === "CANCELLED") {
            setIsCancelModalOpen(true);
            setCancelReason('');
        } else {
            updateStatus({ id: reservation.id, status: newStatus });
        }
    };

    const handleConfirmCancel = () => {
        if (!cancelReason.trim()) {
            return; // Có thể hiển thị toast báo lỗi nếu bắt buộc nhập lý do
        }
        updateStatus({ id: reservation.id, status: "CANCELLED", cancellation_reason: cancelReason }, {
            onSuccess: () => {
                setIsCancelModalOpen(false);
            }
        });
    };

    const currentOption = statusOptions.find(o => o.value === reservation.status) || statusOptions[0];

    return (
        <>
            <select
                value={reservation.status}
                onChange={handleChange}
                disabled={isPending}
                className={`text-sm rounded-lg px-2 py-1 outline-none cursor-pointer border border-transparent hover:border-gray-300 transition-all ${currentOption.color}`}
            >
                {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="text-gray-800 bg-white">
                        {opt.label}
                    </option>
                ))}
            </select>

            {isCancelModalOpen && (
                <div className="fixed inset-0 z-[70] flex justify-center items-center bg-black/40 backdrop-blur-sm transition-all duration-300 p-4">
                    <div className="w-full max-w-md bg-white shadow-2xl flex flex-col rounded-2xl overflow-hidden animate-fade-in text-left">
                        <div className="p-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Xác nhận huỷ đặt bàn</h3>
                            <p className="text-gray-500 text-sm mt-1">Vui lòng nhập lý do huỷ đơn đặt bàn của khách hàng {reservation.guest_name}</p>
                        </div>
                        <div className="p-5">
                            <textarea 
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="VD: Khách gọi điện báo bận đột xuất..."
                                className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px] outline-none focus:border-red-500 bg-white text-gray-700 text-sm"
                                autoFocus
                            />
                        </div>
                        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                            <button 
                                onClick={() => setIsCancelModalOpen(false)}
                                className="px-5 py-2 rounded-xl text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors font-medium text-sm"
                                disabled={isPending}
                            >
                                Quay lại
                            </button>
                            <button 
                                onClick={handleConfirmCancel}
                                disabled={isPending || !cancelReason.trim()}
                                className="px-5 py-2 rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors font-medium text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Đang xử lý..." : "Xác nhận huỷ"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
