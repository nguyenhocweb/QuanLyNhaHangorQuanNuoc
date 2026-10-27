"use client";

import React, { useState } from "react";
import { useGetAreasWithTables } from "@/src/features/quan_ly_nha_hang/tables/hook/useGetAreasWithTables";
import { PairingModalPOS } from "./PairingModalPOS";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { FaTabletAlt, FaExternalLinkAlt, FaQrcode, FaUsers, FaInfoCircle } from "react-icons/fa";
import { MdOutlineTableRestaurant, MdStore } from "react-icons/md";
import FadeIn from "@/src/core/components/animation/FadeIn";

export const ManagerTableKioskDashboard: React.FC = () => {
    const { activeWorkspace } = useAuthStore();
    const restaurantId = activeWorkspace?.id;

    const { data: areasData, isLoading } = useGetAreasWithTables();
    const areas = areasData?.data || [];

    const [selectedAreaId, setSelectedAreaId] = useState<string>("ALL");
    const [selectedTableForPairing, setSelectedTableForPairing] = useState<{ id: string; number: string } | null>(null);

    // Lọc danh sách bàn theo khu vực
    const filteredTables = areas.flatMap((area: any) => {
        if (selectedAreaId !== "ALL" && area.id !== selectedAreaId) return [];
        return (area.tables || []).map((table: any) => ({
            ...table,
            areaName: area.name
        }));
    });

    return (
        <FadeIn className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                        <FaTabletAlt className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            Quản Lý & Ghép Nối Tablet Bàn Ăn
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Sinh mã PIN 6 số an toàn để kết nối máy tính bảng tại từng bàn với hệ thống gọi món tự phục vụ.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <a
                        href="/kiosk/pairing"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-sm"
                    >
                        <FaExternalLinkAlt className="text-xs" />
                        <span>Mở màn hình nhập PIN Tablet</span>
                    </a>
                </div>
            </div>

            {/* Quick Tutorial Guide Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-5 flex items-start gap-4">
                <FaInfoCircle className="text-amber-600 text-xl flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-950 flex flex-col gap-1.5">
                    <span className="font-bold text-amber-900">Quy trình kết nối máy tính bảng với bàn:</span>
                    <ol className="list-decimal list-inside space-y-1 text-amber-800">
                        <li>Chọn bàn ăn bạn muốn gán thiết bị trong danh sách bên dưới và bấm nút <strong>"📱 Lấy mã PIN kết nối"</strong>.</li>
                        <li>Màn hình POS sẽ hiển thị <strong>Mã PIN 6 số</strong> (có hiệu lực 5 phút).</li>
                        <li>Trên máy tính bảng đặt tại bàn, mở trang <code>/kiosk/pairing</code> và gõ 6 số PIN để kích hoạt vĩnh viễn cho bàn đó.</li>
                    </ol>
                </div>
            </div>

            {/* Area Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                    onClick={() => setSelectedAreaId("ALL")}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                        selectedAreaId === "ALL"
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/80"
                    }`}
                >
                    Tất cả khu vực ({filteredTables.length} bàn)
                </button>
                {areas.map((area: any) => (
                    <button
                        key={area.id}
                        onClick={() => setSelectedAreaId(area.id)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                            selectedAreaId === area.id
                                ? "bg-slate-900 text-white shadow-sm"
                                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/80"
                        }`}
                    >
                        {area.name} ({area.tables?.length || 0})
                    </button>
                ))}
            </div>

            {/* Tables Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="bg-white rounded-2xl h-44 animate-pulse border border-gray-100"></div>
                    ))}
                </div>
            ) : filteredTables.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center">
                    <MdOutlineTableRestaurant className="text-5xl text-gray-300 mb-3" />
                    <h3 className="text-base font-semibold text-gray-700">Chưa có bàn nào trong khu vực này</h3>
                    <p className="text-xs text-gray-400 mt-1">Vui lòng tạo bàn trong mục Sơ đồ Bàn trước.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredTables.map((table: any) => (
                        <div
                            key={table.id}
                            className="bg-white rounded-2xl border border-gray-100 hover:border-amber-200 p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-all group"
                        >
                            {/* Table Card Top */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-100/80 text-amber-700 font-extrabold text-lg flex items-center justify-center border border-amber-200/60 font-mono transition-colors">
                                        {table.table_number}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base">
                                            Bàn {table.table_number}
                                        </h3>
                                        <span className="text-xs text-gray-400 font-medium block">
                                            {table.areaName}
                                        </span>
                                    </div>
                                </div>

                                <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                    <FaUsers className="text-gray-400 text-xs" />
                                    <span>{table.max_capacity || 4} chỗ</span>
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                                {/* Button Generate PIN Code */}
                                <button
                                    onClick={() => setSelectedTableForPairing({ id: table.id, number: table.table_number })}
                                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <FaTabletAlt />
                                    <span>Lấy mã PIN Ghép Nối</span>
                                </button>

                                {/* Direct Preview Kiosk Link */}
                                <a
                                    href={`/kiosk/${restaurantId}/${table.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                                >
                                    <FaExternalLinkAlt className="text-[11px]" />
                                    <span>Mở thử màn hình Kiosk bàn này</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pairing Modal (Generates 6-digit PIN) */}
            {selectedTableForPairing && (
                <PairingModalPOS
                    tableId={selectedTableForPairing.id}
                    tableNumber={selectedTableForPairing.number}
                    restaurantId={restaurantId}
                    isOpen={!!selectedTableForPairing}
                    onClose={() => setSelectedTableForPairing(null)}
                />
            )}
        </FadeIn>
    );
};
