"use client";

import React, { useState } from 'react';
import { useGetReservations } from "@/src/features/quan_ly_nha_hang/reservations/hook/useGetReservations";
import { ReservationList } from "@/src/features/quan_ly_nha_hang/reservations/component/ReservationList";
import { ReservationFormModal } from "@/src/features/quan_ly_nha_hang/reservations/component/ReservationFormModal";
import { AssignTableModal } from "@/src/features/quan_ly_nha_hang/reservations/component/AssignTableModal";
import { Reservation } from "@/src/features/quan_ly_nha_hang/reservations/type/reservation.type";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { Button } from "@/src/core/components/ui/Button";
import { Input } from "@/src/core/components/ui/Input";
import { BsCalendar2Check, BsSearch } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import useDebounce from "@/src/core/hooks/useDebounce";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import useRealtimeUpdates from "@/src/core/hooks/useRealtimeUpdates";

export default function ReservationsPage() {
    const { activeWorkspace } = useAuthStore();
    const restaurantId = activeWorkspace?.id || ""; 
    useRealtimeUpdates(restaurantId); 

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce({ value: searchTerm, delay: 500 });
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [statusFilter, setStatusFilter] = useState("ALL");

    const { data, isLoading } = useGetReservations(restaurantId, {
        date: dateFilter,
        status: statusFilter,
        search: debouncedSearch
    });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const [assigningReservation, setAssigningReservation] = useState<Reservation | null>(null);

    const handleCreateNew = () => {
        setEditingReservation(null);
        setIsFormOpen(true);
    };

    const handleEdit = (res: Reservation) => {
        setEditingReservation(res);
        setIsFormOpen(true);
    };

    const handleAssignTable = (res: Reservation) => {
        setAssigningReservation(res);
    };

    return (
        <FadeIn className="w-full flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <BsCalendar2Check className="text-indigo-600" />
                        Quản lý Đặt bàn
                    </h1>
                    <p className="text-gray-500 mt-1">Quản lý và theo dõi lịch đặt bàn của nhà hàng</p>
                </div>
                <Button onClick={handleCreateNew} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <FiPlus className="text-xl" />
                    Thêm đặt bàn
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[250px]">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <BsSearch className="text-gray-400" />
                    </div>
                    <Input 
                        placeholder="Tìm theo tên khách, số điện thoại..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                    />
                </div>
                <div className="flex gap-4">
                    <input 
                        type="date" 
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="h-11 px-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-500 text-gray-700"
                    />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-11 px-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-500 text-gray-700 bg-white"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ xác nhận</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="SEATED">Đã xếp bàn (Seated)</option>
                        <option value="COMPLETED">Hoàn thành</option>
                        <option value="CANCELLED">Đã hủy</option>
                    </select>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-gray-100 rounded-2xl"></div>
                    <div className="h-16 bg-gray-100 rounded-2xl"></div>
                    <div className="h-16 bg-gray-100 rounded-2xl"></div>
                </div>
            ) : (
                <ReservationList 
                    reservations={data?.metadata?.data || []} 
                    onEdit={handleEdit} 
                    onAssignTable={handleAssignTable}
                    restaurantId={restaurantId}
                />
            )}

            {/* Modals */}
            <ReservationFormModal 
                open={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                restaurantId={restaurantId}
                editingReservation={editingReservation}
            />

            {assigningReservation && (
                <AssignTableModal 
                    reservation={assigningReservation}
                    restaurantId={restaurantId}
                    onClose={() => setAssigningReservation(null)}
                />
            )}
        </FadeIn>
    );
}
