import React from 'react';
import { Reservation } from "../type/reservation.type";
import { StatusDropdown } from "./StatusDropdown";
import { MdOutlineTableRestaurant, MdEdit } from "react-icons/md";

interface ReservationListProps {
    reservations: Reservation[];
    onEdit: (res: Reservation) => void;
    onAssignTable: (res: Reservation) => void;
    restaurantId: string;
}

export const ReservationList = ({ reservations, onEdit, onAssignTable, restaurantId }: ReservationListProps) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                            <th className="p-4 font-semibold">Khách hàng</th>
                            <th className="p-4 font-semibold">Thời gian</th>
                            <th className="p-4 font-semibold text-center">Số người</th>
                            <th className="p-4 font-semibold">Trạng thái</th>
                            <th className="p-4 font-semibold">Bàn đã xếp</th>
                            <th className="p-4 font-semibold text-right">Ngày tạo</th>
                            <th className="p-4 font-semibold text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reservations.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-500">
                                    Không có dữ liệu đặt bàn nào.
                                </td>
                            </tr>
                        ) : (
                            reservations.map((res) => (
                                <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-800">{res.guest_name}</div>
                                        <div className="text-sm text-gray-500">{res.guest_phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-700">{res.start_time}</div>
                                        <div className="text-sm text-gray-500">{new Date(res.reservation_date).toLocaleDateString('vi-VN')}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 w-8 h-8 rounded-full font-medium">
                                            {res.party_size}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <StatusDropdown reservation={res} restaurantId={restaurantId} />
                                    </td>
                                    <td className="p-4">
                                        {res.reservation_tables && res.reservation_tables.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-1.5 cursor-pointer w-48" onClick={() => onAssignTable(res)}>
                                                {res.reservation_tables.map(rt => (
                                                    <span key={rt.id} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors text-center truncate" title={rt.table.area?.name ? `${rt.table.area.name} - ${rt.table.table_number}` : rt.table.table_number}>
                                                        {rt.table.area?.name ? `${rt.table.area.name} - ${rt.table.table_number}` : rt.table.table_number}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => onAssignTable(res)}
                                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline flex items-center gap-1"
                                            >
                                                <MdOutlineTableRestaurant />
                                                Chưa xếp bàn
                                            </button>
                                        )}
                                    </td>
                                    <td className="p-4 text-right text-sm text-gray-500">
                                        {new Date(res.createdAt).toLocaleString('vi-VN', { 
                                            hour: '2-digit', 
                                            minute: '2-digit',
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => onEdit(res)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Chỉnh sửa"
                                        >
                                            <MdEdit className="text-xl" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
