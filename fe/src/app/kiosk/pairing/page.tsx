"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyTablePairingService } from "@/src/features/public/table_kiosk/service/kiosk.pairing.service";
import { toast } from "sonner";
import { FaTabletAlt, FaBackspace, FaLock, FaStore } from "react-icons/fa";
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function TableKioskPairingPage() {
    const router = useRouter();
    const [pin, setPin] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleNumberClick = (digit: string) => {
        if (pin.length < 6) {
            setPin((prev) => prev + digit);
        }
    };

    const handleBackspace = () => {
        setPin((prev) => prev.slice(0, -1));
    };

    const handleClear = () => {
        setPin("");
    };

    const handleVerify = async (codeToVerify?: string) => {
        const finalCode = codeToVerify || pin;
        if (finalCode.length !== 6) {
            toast.error("Vui lòng nhập đủ 6 chữ số mã kết nối");
            return;
        }

        setIsLoading(true);
        try {
            const res = await verifyTablePairingService(finalCode);
            const data = res.metadata;

            // Lưu thông tin ghép nối vào LocalStorage của Tablet
            localStorage.setItem("tableDeviceToken", data.tableDeviceToken);
            localStorage.setItem("kioskRestaurantId", data.restaurantId);
            localStorage.setItem("kioskTableId", data.tableId);
            localStorage.setItem("kioskTableNumber", data.tableNumber);

            toast.success(`Kết nối thành công với Bàn ${data.tableNumber}!`);
            router.push(`/kiosk/${data.restaurantId}/${data.tableId}`);
        } catch (error: any) {
            const message = error?.response?.data?.message || "Mã kết nối không hợp lệ hoặc đã hết hạn";
            toast.error(message);
            setPin("");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col items-center justify-center p-4 select-none">
            {/* Background Ambience */}
            <div className="absolute top-1/3 -left-32 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <FadeIn className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center z-10">
                {/* Header */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
                    <FaTabletAlt className="text-3xl" />
                </div>

                <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">
                    Cài Đặt Tablet Bàn Ăn
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 text-center mb-6">
                    Nhập mã PIN 6 chữ số đang hiển thị trên màn hình POS của Quản lý để kết nối thiết bị này với bàn.
                </p>

                {/* PIN Display Boxes */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 w-full">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                        <div
                            key={index}
                            className={`w-11 h-13 sm:w-12 sm:h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold font-mono transition-all duration-200 ${
                                pin[index]
                                    ? "border-amber-400 bg-amber-400/10 text-amber-300 shadow-sm shadow-amber-400/20 scale-105"
                                    : "border-white/10 bg-white/5 text-slate-500"
                            }`}
                        >
                            {pin[index] || "•"}
                        </div>
                    ))}
                </div>

                {/* On-Screen Touch Numpad */}
                <div className="grid grid-cols-3 gap-3 w-full mb-6">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumberClick(num)}
                            className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-2xl transition-all duration-150 flex items-center justify-center border border-white/5"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={handleClear}
                        className="h-14 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 active:scale-95 text-rose-400 font-semibold text-sm transition-all duration-150 flex items-center justify-center border border-rose-500/20"
                    >
                        Xóa hết
                    </button>
                    <button
                        onClick={() => handleNumberClick("0")}
                        className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-2xl transition-all duration-150 flex items-center justify-center border border-white/5"
                    >
                        0
                    </button>
                    <button
                        onClick={handleBackspace}
                        className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 text-xl transition-all duration-150 flex items-center justify-center border border-white/5"
                    >
                        <FaBackspace />
                    </button>
                </div>

                {/* Submit button */}
                <button
                    onClick={() => handleVerify()}
                    disabled={pin.length !== 6 || isLoading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-40 disabled:hover:from-amber-500 text-slate-950 font-bold text-base transition-all duration-200 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <FaLock className="text-sm" />
                            Xác nhận Ghép Nối Bàn
                        </>
                    )}
                </button>
            </FadeIn>
        </div>
    );
}
