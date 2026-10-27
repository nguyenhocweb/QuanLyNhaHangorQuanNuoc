"use client";

import React, { useState, useEffect } from "react";
import { generateTablePairingService, GeneratePairingResponse } from "../service/kiosk.pairing.service";
import { FaTabletAlt, FaTimes, FaClock } from "react-icons/fa";
import { toast } from "sonner";

interface PairingModalPOSProps {
    tableId: string;
    tableNumber: string;
    restaurantId?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const PairingModalPOS: React.FC<PairingModalPOSProps> = ({
    tableId,
    tableNumber,
    restaurantId,
    isOpen,
    onClose
}) => {
    const [pairingData, setPairingData] = useState<GeneratePairingResponse | null>(null);
    const [timeLeft, setTimeLeft] = useState(300);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && tableId) {
            fetchPairingCode();
        }
    }, [isOpen, tableId]);

    const fetchPairingCode = async () => {
        setIsLoading(true);
        try {
            const res = await generateTablePairingService(tableId, restaurantId);
            const data = res?.metadata || (res as any)?.data || res;
            setPairingData(data);
            setTimeLeft(data?.expiresInSeconds || 300);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Không thể tạo mã ghép nối");
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isOpen, timeLeft]);

    if (!isOpen) return null;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                            <FaTabletAlt className="text-xl" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Ghép Nối Tablet Bàn Ăn</h3>
                            <span className="text-xs text-gray-500 font-medium">Bàn {tableNumber}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <div className="py-6 flex flex-col items-center text-center">
                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm text-gray-500">Đang sinh mã kết nối an toàn...</span>
                        </div>
                    ) : pairingData ? (
                        <>
                            <p className="text-sm text-gray-600 mb-6">
                                Mở màn hình Tablet tại bàn và nhập mã PIN 6 số dưới đây để kết nối với <strong className="text-gray-900 font-bold">Bàn {tableNumber}</strong>:
                            </p>

                            {/* Large 6-digit Code */}
                            <div className="flex items-center gap-2 sm:gap-3 mb-6">
                                {String(pairingData.pairingCode || "").split("").map((digit, idx) => (
                                    <div
                                        key={idx}
                                        className="w-11 h-14 sm:w-12 sm:h-16 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-800 text-2xl sm:text-3xl font-extrabold font-mono flex items-center justify-center shadow-sm"
                                    >
                                        {digit}
                                    </div>
                                ))}
                            </div>

                            {/* Timer */}
                            <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-gray-600">
                                <FaClock className={timeLeft < 60 ? "text-rose-500 animate-pulse" : "text-gray-400"} />
                                <span>
                                    Mã có hiệu lực trong:{" "}
                                    <strong className={timeLeft < 60 ? "text-rose-600 font-mono" : "text-gray-900 font-mono"}>
                                        {formatTime(timeLeft)}
                                    </strong>
                                </span>
                            </div>

                            {timeLeft === 0 && (
                                <button
                                    onClick={fetchPairingCode}
                                    className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors"
                                >
                                    Lấy mã mới
                                </button>
                            )}
                        </>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};
