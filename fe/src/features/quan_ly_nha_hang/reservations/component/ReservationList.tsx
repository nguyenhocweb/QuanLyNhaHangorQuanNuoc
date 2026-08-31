import React from 'react';
import { Reservation } from "../type/reservation.type";
import { StatusDropdown } from "./StatusDropdown";
import { useUpdateReservationStatus } from "../hook/useUpdateReservationStatus";
import { MdOutlineTableRestaurant, MdEdit, MdCheck, MdClose } from "react-icons/md";
import { FaUserFriends, FaRegClock, FaRegCalendarAlt, FaBirthdayCake, FaHeart, FaBriefcase, FaGlassCheers } from "react-icons/fa";
import { BsPersonCheck } from "react-icons/bs";

interface ReservationListProps {
    reservations: Reservation[];
    onEdit: (res: Reservation) => void;
    onAssignTable: (res: Reservation) => void;
    restaurantId: string;
}

export const ReservationList = ({ reservations, onEdit, onAssignTable, restaurantId }: ReservationListProps) => {
    const { mutate: updateStatus, isPending } = useUpdateReservationStatus(restaurantId);

    // Tính toán thời lượng dùng bữa (ví dụ: "2h")
    const calculateDuration = (startTime: string, endTime?: string) => {
        if (!endTime || !startTime) return null;
        try {
            const [sh, sm] = startTime.split(':').map(Number);
            const [eh, em] = endTime.split(':').map(Number);
            let diffMinutes = (eh * 60 + em) - (sh * 60 + sm);
            if (diffMinutes < 0) diffMinutes += 24 * 60;
            const hours = Math.floor(diffMinutes / 60);
            const mins = diffMinutes % 60;
            if (mins === 0) return `${hours} tiếng`;
            return `${hours}h${mins}p`;
        } catch {
            return null;
        }
    };

    // Kiểm tra có phải ngày hôm nay không
    const isToday = (dateStr: string) => {
        if (!dateStr) return false;
        const resDate = new Date(dateStr);
        const today = new Date();
        return resDate.getFullYear() === today.getFullYear() &&
               resDate.getMonth() === today.getMonth() &&
               resDate.getDate() === today.getDate();
    };

    // Render Tag Dịp đặc biệt
    const renderOccasionBadge = (occasion?: string) => {
        if (!occasion || occasion === 'NORMAL') return null;
        switch (occasion) {
            case 'BIRTHDAY':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-pink-50 text-pink-700 border border-pink-200 whitespace-nowrap">
                        <FaBirthdayCake className="text-pink-500" /> Sinh nhật
                    </span>
                );
            case 'ANNIVERSARY':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                        <FaHeart className="text-rose-500" /> Kỷ niệm
                    </span>
                );
            case 'DATE':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap">
                        <FaGlassCheers className="text-purple-500" /> Hẹn hò
                    </span>
                );
            case 'BUSINESS':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                        <FaBriefcase className="text-blue-500" /> Tiếp khách
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            <th className="p-4 font-bold">Khách hàng</th>
                            <th className="p-4 font-bold">Thời gian</th>
                            <th className="p-4 font-bold text-center">Số khách</th>
                            <th className="p-4 font-bold">Trạng thái</th>
                            <th className="p-4 font-bold">Bàn</th>
                            <th className="p-4 font-bold text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reservations.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <FaRegCalendarAlt className="text-3xl text-gray-300" />
                                        <p className="text-sm font-medium">Không có dữ liệu đặt bàn nào trong mục này.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            reservations.map((res) => {
                                const duration = calculateDuration(res.start_time, res.end_time);
                                return (
                                    <tr key={res.id} className="hover:bg-gray-50/60 transition-colors">
                                        {/* Khách hàng */}
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 max-w-[220px]">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-gray-900 text-sm truncate" title={res.guest_name}>
                                                        {res.guest_name}
                                                    </span>
                                                    {renderOccasionBadge(res.occasion)}
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono truncate" title={res.guest_phone}>
                                                    {res.guest_phone}
                                                    {res.guest_email && ` • ${res.guest_email}`}
                                                </div>
                                                {res.special_requests && (
                                                    <div className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 mt-0.5 truncate" title={res.special_requests}>
                                                        💬 {res.special_requests}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Thời gian */}
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                                                    <FaRegClock className="text-indigo-500 text-xs" />
                                                    <span>{res.start_time}</span>
                                                    {res.end_time && (
                                                        <span className="text-gray-500 font-normal">
                                                            ➔ {res.end_time}
                                                        </span>
                                                    )}
                                                    {duration && (
                                                        <span className="text-[11px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-medium ml-1">
                                                            {duration}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <FaRegCalendarAlt className="text-gray-400 text-xs" />
                                                    {new Date(res.reservation_date).toLocaleDateString('vi-VN', {
                                                        weekday: 'short',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Số khách */}
                                        <td className="p-4 text-center whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-100">
                                                <FaUserFriends className="text-xs" />
                                                {res.party_size}
                                            </span>
                                        </td>

                                        {/* Trạng thái */}
                                        <td className="p-4 whitespace-nowrap">
                                            <StatusDropdown reservation={res} restaurantId={restaurantId} />
                                        </td>

                                        {/* Bàn đã xếp */}
                                        <td className="p-4">
                                            {res.reservation_tables && res.reservation_tables.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5 cursor-pointer max-w-[180px]" onClick={() => onAssignTable(res)}>
                                                    {res.reservation_tables.map(rt => (
                                                        <span key={rt.id} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors truncate" title={rt.table.area?.name ? `${rt.table.area.name} - ${rt.table.table_number}` : rt.table.table_number}>
                                                            🪑 {rt.table.area?.name ? `${rt.table.area.name} - ${rt.table.table_number}` : rt.table.table_number}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => onAssignTable(res)}
                                                    className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                                                >
                                                    <MdOutlineTableRestaurant className="text-base" />
                                                    Chưa xếp bàn
                                                </button>
                                            )}
                                        </td>

                                        {/* Thao tác */}
                                        <td className="p-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* Nút Phê duyệt nhanh nếu là PENDING */}
                                                {res.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus({ id: res.id, status: 'CONFIRMED' })}
                                                            disabled={isPending}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                                            title="Duyệt đơn đặt bàn ngay"
                                                        >
                                                            <MdCheck className="text-sm" /> Duyệt
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus({ id: res.id, status: 'CANCELLED', cancellation_reason: 'Nhà hàng hết chỗ hoặc không thể phục vụ' })}
                                                            disabled={isPending}
                                                            className="flex items-center gap-1 px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold border border-red-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                                            title="Từ chối đơn"
                                                        >
                                                            <MdClose className="text-sm" /> Từ chối
                                                        </button>
                                                    </>
                                                )}

                                                {/* Nút Tiếp đón khách CHỈ HIỂN THỊ KHI: Đã xác nhận (CONFIRMED) VÀ Đúng ngày hôm nay */}
                                                {res.status === 'CONFIRMED' && isToday(res.reservation_date) && (
                                                    <button
                                                        onClick={() => updateStatus({ id: res.id, status: 'SEATED' })}
                                                        disabled={isPending}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                                        title="Khách đã đến nhận bàn hôm nay"
                                                    >
                                                        <BsPersonCheck className="text-sm" /> Đã đến
                                                    </button>
                                                )}

                                                {/* Nút Chỉnh sửa */}
                                                <button 
                                                    onClick={() => onEdit(res)}
                                                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Chỉnh sửa chi tiết"
                                                >
                                                    <MdEdit className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
