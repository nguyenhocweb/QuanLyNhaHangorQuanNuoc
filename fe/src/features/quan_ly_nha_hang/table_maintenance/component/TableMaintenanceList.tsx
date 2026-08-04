"use client";

import React, { useState } from "react";
import { useGetTableMaintenance } from "../hook/useGetTableMaintenance";
import { useUpdateTableMaintenance } from "../hook/useUpdateTableMaintenance";
import { useDeleteTableMaintenance } from "../hook/useDeleteTableMaintenance";
import { ITableMaintenanceSchedule, MaintenanceStatus } from "../type/table_maintenance.type";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { FaTools, FaCheck, FaTrash, FaBan, FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";

interface Props {
    restaurantId: string;
}

export default function TableMaintenanceList({ restaurantId }: Props) {
    const { data, isLoading, isError } = useGetTableMaintenance(restaurantId);
    const { mutate: updateStatus } = useUpdateTableMaintenance();
    const { mutate: deleteSchedule } = useDeleteTableMaintenance();

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    const schedules = (data as any)?.data?.metadata?.items || (data as any)?.metadata?.items || [];


    const filteredSchedules = statusFilter === "ALL"
        ? schedules
        : schedules.filter((s: ITableMaintenanceSchedule) => s.status === statusFilter);

    const handleStatusChange = (id: string, status: MaintenanceStatus) => {
        updateStatus({ id, payload: { status } });
    };

    const handleDelete = () => {
        if (deletingId) {
            deleteSchedule(deletingId, {
                onSuccess: () => setDeletingId(null)
            });
        }
    };

    const getStatusBadge = (status: MaintenanceStatus) => {
        switch (status) {
            case "SCHEDULED":
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">Đã lên lịch</span>;
            case "IN_PROGRESS":
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">Đang bảo trì</span>;
            case "COMPLETED":
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">Đã hoàn thành</span>;
            case "CANCELLED":
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200">Đã hủy</span>;
            default:
                return null;
        }
    };

    return (
        <FadeIn className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                        <FaTools className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Danh sách bảo trì bàn</h2>
                        <p className="text-xs text-gray-500">Quản lý các đợt bảo trì, sửa chữa bàn ăn trong nhà hàng</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        onClick={() => setStatusFilter("ALL")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                            statusFilter === "ALL" ? "bg-indigo-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Tất cả
                    </button>
                    <button
                        onClick={() => setStatusFilter("SCHEDULED")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                            statusFilter === "SCHEDULED" ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Đã lên lịch
                    </button>
                    <button
                        onClick={() => setStatusFilter("IN_PROGRESS")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                            statusFilter === "IN_PROGRESS" ? "bg-amber-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Đang bảo trì
                    </button>
                    <button
                        onClick={() => setStatusFilter("COMPLETED")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                            statusFilter === "COMPLETED" ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Hoàn thành
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
                    <span>Đang tải danh sách bảo trì...</span>
                </div>
            ) : isError ? (
                <div className="text-center py-12 text-red-500">
                    <FaExclamationCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Không thể tải dữ liệu bảo trì. Vui lòng thử lại sau!</p>
                </div>
            ) : filteredSchedules.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <FaCalendarAlt className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium text-gray-600">Chưa có lịch bảo trì nào</p>
                    <p className="text-xs text-gray-400 mt-1">Các lịch bảo trì được lên kế hoạch sẽ xuất hiện tại đây.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase bg-gray-50/50">
                                <th className="p-4 rounded-l-xl">Bàn bảo trì</th>
                                <th className="p-4">Thời gian</th>
                                <th className="p-4">Lý do</th>
                                <th className="p-4">Trạng thái</th>
                                <th className="p-4 text-right rounded-r-xl">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredSchedules.map((item: ITableMaintenanceSchedule) => {
                                const tableNumbers = item.tables?.map(t => `Bàn ${t.table_number}`).join(", ") || `${item.tableIds?.length || 0} bàn`;
                                const startStr = new Date(item.start_time).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
                                const endStr = new Date(item.end_time).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });

                                return (
                                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                                        <td className="p-4 font-semibold text-gray-800">
                                            {tableNumbers}
                                        </td>
                                        <td className="p-4 text-gray-600 text-xs">
                                            <div><span className="font-medium text-gray-500">Từ:</span> {startStr}</div>
                                            <div><span className="font-medium text-gray-500">Đến:</span> {endStr}</div>
                                        </td>
                                        <td className="p-4 text-gray-600 max-w-xs truncate" title={item.reason || ""}>
                                            {item.reason || "<Không có lý do>"}
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {item.status === "SCHEDULED" && (
                                                    <button
                                                        onClick={() => handleStatusChange(item.id, "IN_PROGRESS")}
                                                        title="Bắt đầu bảo trì"
                                                        className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all duration-200"
                                                    >
                                                        <FaTools className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {(item.status === "SCHEDULED" || item.status === "IN_PROGRESS") && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(item.id, "COMPLETED")}
                                                            title="Hoàn thành bảo trì"
                                                            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all duration-200"
                                                        >
                                                            <FaCheck className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(item.id, "CANCELLED")}
                                                            title="Hủy lịch bảo trì"
                                                            className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all duration-200"
                                                        >
                                                            <FaBan className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setDeletingId(item.id)}
                                                    title="Xóa lịch bảo trì"
                                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmModal
                open={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={handleDelete}
                title="Xóa lịch bảo trì"
                content="Bạn có chắc chắn muốn xóa lịch bảo trì này không? Hành động này không thể hoàn tác."
            />
        </FadeIn>
    );
}
