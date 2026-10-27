"use client";

import React, { useState } from "react";
import { FaBell, FaWater, FaReceipt } from "react-icons/fa";
import { MdOutlineCleaningServices } from "react-icons/md";
import { useKioskServiceCall } from "../hook/useKioskServiceCall";

interface KioskServiceCallBarProps {
    restaurantId: string;
    tableId: string;
    tableNumber: string;
}

export const KioskServiceCallBar: React.FC<KioskServiceCallBarProps> = ({ restaurantId, tableId, tableNumber }) => {
    const { mutate: callService, isPending } = useKioskServiceCall();
    const [activeAction, setActiveAction] = useState<string | null>(null);

    const handleCall = (type: any, label: string) => {
        setActiveAction(type);
        callService(
            { restaurantId, tableId, type },
            {
                onSettled: () => {
                    setTimeout(() => setActiveAction(null), 3000);
                }
            }
        );
    };

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center gap-2 max-w-2xl w-[92vw] sm:w-auto justify-around">
            {/* Call Staff */}
            <button
                onClick={() => handleCall("CALL_STAFF", "Gọi nhân viên")}
                disabled={isPending}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                    activeAction === "CALL_STAFF"
                        ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105"
                        : "bg-white/10 hover:bg-white/20 text-white"
                }`}
            >
                <FaBell className="text-amber-400 text-base" />
                <span className="hidden sm:inline">Gọi phục vụ</span>
                <span className="sm:hidden">Phục vụ</span>
            </button>

            {/* Request Water */}
            <button
                onClick={() => handleCall("WATER", "Xin nước")}
                disabled={isPending}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                    activeAction === "WATER"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                        : "bg-white/10 hover:bg-white/20 text-white"
                }`}
            >
                <FaWater className="text-blue-400 text-base" />
                <span>Thêm nước</span>
            </button>

            {/* Request Ice */}
            <button
                onClick={() => handleCall("ICE", "Xin thêm đá")}
                disabled={isPending}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                    activeAction === "ICE"
                        ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 scale-105"
                        : "bg-white/10 hover:bg-white/20 text-white"
                }`}
            >
                <span className="text-base">🧊</span>
                <span>Thêm đá</span>
            </button>

            {/* Clean Table */}
            <button
                onClick={() => handleCall("CLEAN_TABLE", "Dọn đĩa")}
                disabled={isPending}
                className={`hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                    activeAction === "CLEAN_TABLE"
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105"
                        : "bg-white/10 hover:bg-white/20 text-white"
                }`}
            >
                <MdOutlineCleaningServices className="text-emerald-400 text-base" />
                <span>Dọn đĩa trống</span>
            </button>

            {/* Request Cash Bill */}
            <button
                onClick={() => handleCall("BILL_CASH", "Yêu cầu hóa đơn tiền mặt")}
                disabled={isPending}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                    activeAction === "BILL_CASH"
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105"
                        : "bg-white/10 hover:bg-white/20 text-white"
                }`}
            >
                <FaReceipt className="text-rose-400 text-base" />
                <span className="hidden sm:inline">Tính tiền mặt</span>
                <span className="sm:hidden">Bill mặt</span>
            </button>
        </div>
    );
};
