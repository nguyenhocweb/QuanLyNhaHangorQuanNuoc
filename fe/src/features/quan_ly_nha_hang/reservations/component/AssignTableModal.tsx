import React, { useState } from 'react';
import { Reservation } from "../type/reservation.type";
import { useGetAreasWithTables } from "../../tables/hook/useGetAreasWithTables";
import { useAssignTable } from "../hook/useAssignTable";
import { TableOperationalStatus, AreaType, TableType } from "../../tables/type/table.type";
import { MdClose } from "react-icons/md";
import FadeIn from "@/src/core/components/animation/FadeIn";

interface AssignTableModalProps {
    reservation: Reservation;
    restaurantId: string;
    onClose: () => void;
}

export const AssignTableModal = ({ reservation, restaurantId, onClose }: AssignTableModalProps) => {
    const { data: areasData, isLoading } = useGetAreasWithTables();
    const { assign, unassign } = useAssignTable(restaurantId);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

    const assignedTableIds = reservation.reservation_tables?.map(rt => rt.tableId) || [];

    const handleAssign = () => {
        if (!selectedTableId) return;
        assign.mutate({ id: reservation.id, tableId: selectedTableId }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const handleUnassign = (tableId: string) => {
        unassign.mutate({ id: reservation.id, tableId });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <FadeIn className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Xếp bàn cho {reservation.guest_name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {reservation.party_size} khách • {reservation.start_time} - {new Date(reservation.reservation_date).toLocaleDateString('vi-VN')}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MdClose className="text-gray-500 text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto flex-1 space-y-6">
                    {assignedTableIds.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Bàn đã xếp</h4>
                            <div className="flex flex-wrap gap-3">
                                {reservation.reservation_tables?.map(rt => (
                                    <div key={rt.id} className="flex items-center gap-3 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200">
                                        <span className="font-medium">{rt.table.table_number}</span>
                                        <button 
                                            onClick={() => handleUnassign(rt.tableId)}
                                            className="text-green-600 hover:text-green-800 p-1 bg-green-200/50 rounded-md"
                                        >
                                            <MdClose />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Chọn bàn trống</h4>
                        {isLoading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-24 bg-gray-100 rounded-xl"></div>
                                <div className="h-24 bg-gray-100 rounded-xl"></div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {areasData?.data?.map((area: AreaType) => (
                                    <div key={area.id}>
                                        <h5 className="text-gray-600 font-medium mb-3">{area.name}</h5>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                            {area.tables.map((table: TableType) => {
                                                const isAssignedToThis = assignedTableIds.includes(table.id);
                                                const isOccupied = table.operational_status !== TableOperationalStatus.AVAILABLE;
                                                const isSelected = selectedTableId === table.id;
                                                
                                                let tableClass = "bg-white border-gray-200 hover:border-indigo-300 text-gray-700";
                                                
                                                if (isAssignedToThis) {
                                                    tableClass = "bg-green-100 border-green-500 text-green-700 opacity-50 cursor-not-allowed";
                                                } else if (isOccupied) {
                                                    tableClass = "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed";
                                                } else if (isSelected) {
                                                    tableClass = "bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-200";
                                                }

                                                return (
                                                    <button
                                                        key={table.id}
                                                        disabled={isAssignedToThis || isOccupied}
                                                        onClick={() => setSelectedTableId(table.id)}
                                                        className={`p-3 rounded-xl border text-center transition-all ${tableClass}`}
                                                    >
                                                        <div className="font-semibold text-sm">{table.table_number}</div>
                                                        <div className="text-xs mt-1 opacity-75">{table.min_capacity} - {table.max_capacity} chỗ</div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        Đóng
                    </button>
                    <button 
                        disabled={!selectedTableId || assign.isPending}
                        onClick={handleAssign}
                        className="px-5 py-2.5 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 shadow-sm transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        {assign.isPending ? "Đang xử lý..." : "Xác nhận xếp bàn"}
                    </button>
                </div>
            </FadeIn>
        </div>
    );
};
