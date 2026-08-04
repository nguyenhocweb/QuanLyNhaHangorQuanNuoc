"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTableMaintenanceSchema, CreateTableMaintenanceFormValues } from "../schema/table_maintenance.schema";
import { useCreateTableMaintenance } from "../hook/useCreateTableMaintenance";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FaTimes, FaTools } from "react-icons/fa";

interface Props {
    open: boolean;
    onClose: () => void;
    restaurantId: string;
    availableTables: { id: string; table_number: string; area_name?: string }[];
}

export default function CreateTableMaintenanceModal({ open, onClose, restaurantId, availableTables }: Props) {
    const { mutate: createMaintenance, isPending } = useCreateTableMaintenance();
    const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CreateTableMaintenanceFormValues>({
        resolver: zodResolver(createTableMaintenanceSchema) as any,
        defaultValues: {
            restaurantId,
            tableIds: [],
            start_time: "",
            end_time: "",
            reason: ""
        }
    });

    const startTime = watch("start_time");

    React.useEffect(() => {
        if (open && !startTime) {
            const now = new Date();
            const pad = (n: number) => n.toString().padStart(2, "0");
            const formattedStart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
            setValue("start_time", formattedStart, { shouldValidate: true });
        }
    }, [open, startTime, setValue]);

    React.useEffect(() => {
        if (startTime) {
            const startDate = new Date(startTime);
            if (!isNaN(startDate.getTime())) {
                const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000);
                const pad = (n: number) => n.toString().padStart(2, "0");
                const formattedEnd = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}T${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;
                setValue("end_time", formattedEnd, { shouldValidate: true });
            }
        }
    }, [startTime, setValue]);

    const setDurationDays = (days: number) => {
        if (!startTime) return;
        const startDate = new Date(startTime);
        if (!isNaN(startDate.getTime())) {
            const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
            const pad = (n: number) => n.toString().padStart(2, "0");
            const formattedEnd = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}T${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;
            setValue("end_time", formattedEnd, { shouldValidate: true });
        }
    };

    if (!open) return null;


    const handleToggleTable = (id: string) => {
        const next = selectedTableIds.includes(id)
            ? selectedTableIds.filter(t => t !== id)
            : [...selectedTableIds, id];
        setSelectedTableIds(next);
        setValue("tableIds", next, { shouldValidate: true });
    };

    const handleSelectAll = () => {
        if (selectedTableIds.length === availableTables.length) {
            setSelectedTableIds([]);
            setValue("tableIds", [], { shouldValidate: true });
        } else {
            const allIds = availableTables.map(t => t.id);
            setSelectedTableIds(allIds);
            setValue("tableIds", allIds, { shouldValidate: true });
        }
    };

    const onSubmit = (data: CreateTableMaintenanceFormValues) => {
        createMaintenance(data, {
            onSuccess: () => {
                reset();
                setSelectedTableIds([]);
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <FadeIn className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <FaTools className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-bold text-gray-800">Lên lịch bảo trì bàn</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 rounded-lg hover:bg-gray-100"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Chọn bàn bảo trì <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                {selectedTableIds.length === availableTables.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                            </button>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-xl bg-gray-50/50">
                            {availableTables.map((table) => {
                                const isSelected = selectedTableIds.includes(table.id);
                                return (
                                    <div
                                        key={table.id}
                                        onClick={() => handleToggleTable(table.id)}
                                        className={`cursor-pointer p-2 rounded-lg border text-center transition-all duration-200 ${
                                            isSelected
                                                ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold shadow-sm"
                                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        <div className="text-sm">Bàn {table.table_number}</div>
                                        {table.area_name && (
                                            <div className="text-[10px] text-gray-400 truncate">{table.area_name}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {errors.tableIds && (
                            <p className="text-xs text-red-500 mt-1">{errors.tableIds.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Thời gian bắt đầu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                {...register("start_time")}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all duration-200"
                            />
                            {errors.start_time && (
                                <p className="text-xs text-red-500 mt-1">{errors.start_time.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Thời gian kết thúc <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setDurationDays(2)}
                                        className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium transition-colors"
                                        title="Mặc định: +2 ngày"
                                    >
                                        +2 ngày
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDurationDays(3)}
                                        className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium transition-colors"
                                    >
                                        +3 ngày
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDurationDays(7)}
                                        className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium transition-colors"
                                    >
                                        +1 tuần
                                    </button>
                                </div>
                            </div>
                            <input
                                type="datetime-local"
                                {...register("end_time")}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all duration-200"
                            />

                            {errors.end_time && (
                                <p className="text-xs text-red-500 mt-1">{errors.end_time.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Lý do bảo trì / Ghi chú
                        </label>
                        <textarea
                            rows={3}
                            {...register("reason")}
                            placeholder="Ví dụ: Sửa chân bàn, thay nệm ghế, sơn lại mặt bàn..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all duration-200 resize-none"
                        />
                        {errors.reason && (
                            <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all duration-200"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || selectedTableIds.length === 0}
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {isPending ? "Đang xử lý..." : "Lên lịch bảo trì"}
                        </button>
                    </div>
                </form>
            </FadeIn>
        </div>
    );
}
