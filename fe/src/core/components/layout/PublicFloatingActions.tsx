"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePerformanceMode } from "@/src/core/hooks/usePerformanceMode";
import ChatBoxAi from "@/src/features/public/chatbox_ai/chatBoxAi_component/public-chatbox";
import { toast } from "sonner";
import { FaPhoneAlt, FaTimes, FaRobot, FaMagic } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";

export default function PublicFloatingActions() {
    const [isOpen, setIsOpen] = useState(false);
    const [openAiChat, setOpenAiChat] = useState(false);
    const { is3D, toggleMode, isLowEnd } = usePerformanceMode();
    const dockRef = useRef<HTMLDivElement>(null);

    // Đóng dock khi bấm ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Xử lý chuyển đổi 2D/3D
    const handleToggle3D = () => {
        toggleMode();
        if (is3D) {
            toast.info("Đã chuyển sang chế độ 2D Senior Pro Max (Siêu mượt 60 FPS)");
        } else {
            toast.success("Đã bật chế độ 3D Interactive (Trải nghiệm chiều sâu tối đa)");
        }
    };

    return (
        <>
            <div ref={dockRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                
                {/* --- DANH SÁCH MENU ACTION TIỆN ÍCH (SPEED DIAL) --- */}
                {isOpen && (
                    <div className="flex flex-col items-end gap-3 mb-4 animate-fade-in">
                        
                        {/* 1. Chuyển đổi chế độ 2D / 3D */}
                        <button
                            type="button"
                            onClick={handleToggle3D}
                            className={`group flex items-center gap-3 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-extrabold shadow-lg transition-all duration-300 backdrop-blur-xl cursor-pointer ${
                                is3D
                                    ? "bg-indigo-950/90 text-indigo-100 border-indigo-500/50 hover:bg-indigo-900 shadow-indigo-500/30"
                                    : "bg-emerald-950/90 text-emerald-100 border-emerald-500/50 hover:bg-emerald-900 shadow-emerald-500/30"
                            } hover:scale-105 active:scale-95`}
                        >
                            <span className="text-base sm:text-lg animate-bounce">{is3D ? "⚡" : "🚀"}</span>
                            <div className="flex flex-col text-left">
                                <span>{is3D ? "Chế độ 3D đang bật" : "Chế độ 2D siêu mượt"}</span>
                                <span className="text-[10px] opacity-75 font-normal">
                                    {is3D ? "Click về 2D 60FPS" : "Click bật 3D WebGL"}
                                </span>
                            </div>
                            {isLowEnd && (
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" title="Tự động tối ưu cho máy cấu hình thấp" />
                            )}
                        </button>

                        {/* 2. Chat với Trợ lý ảo AI */}
                        <button
                            type="button"
                            onClick={() => {
                                setOpenAiChat(true);
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                        >
                            <div className="w-7 h-7 rounded-full bg-white text-blue-600 flex items-center justify-center text-base shadow-sm">
                                <BsRobot />
                            </div>
                            <div className="flex flex-col text-left">
                                <span>Trợ lý AI 24/7</span>
                                <span className="text-[10px] text-blue-100 font-normal">Hỏi đáp & gợi ý món ngon</span>
                            </div>
                        </button>

                        {/* 3. Liên hệ Zalo Hotline */}
                        <button
                            type="button"
                            onClick={() => window.open("https://zalo.me/0987654321", "_blank")}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0068FF] hover:bg-[#0054cc] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                        >
                            <div className="w-7 h-7 rounded-full bg-white text-[#0068FF] font-black text-[10px] flex items-center justify-center shadow-sm">
                                Zalo
                            </div>
                            <div className="flex flex-col text-left">
                                <span>Chat Zalo Hotline</span>
                                <span className="text-[10px] text-blue-100 font-normal">0987.654.321</span>
                            </div>
                        </button>

                        {/* 4. Gọi điện trực tiếp */}
                        <button
                            type="button"
                            onClick={() => { window.location.href = "tel:0987654321"; }}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                        >
                            <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs shadow-sm">
                                <FaPhoneAlt />
                            </div>
                            <div className="flex flex-col text-left">
                                <span>Gọi ngay Hotline</span>
                                <span className="text-[10px] text-emerald-100 font-normal">Hỗ trợ đặt bàn VIP</span>
                            </div>
                        </button>

                    </div>
                )}

                {/* --- NÚT TRIGGER CHÍNH GỘP TIỆN ÍCH --- */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    title={isOpen ? "Đóng menu tiện ích" : "Mở menu tiện ích, chat AI & hotline"}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 cursor-pointer ${
                        isOpen
                            ? "bg-gray-800 hover:bg-gray-900 rotate-90 scale-95"
                            : "bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-600 hover:scale-110 shadow-indigo-500/40"
                    }`}
                >
                    {/* Vòng sáng nhịp thở khi đóng */}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
                    )}
                    
                    {isOpen ? (
                        <FaTimes className="text-xl sm:text-2xl" />
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-0.5">
                            <FaMagic className="text-lg sm:text-xl animate-bounce" />
                            <span className="text-[9px] font-black tracking-tighter uppercase leading-none">VIP</span>
                        </div>
                    )}
                </button>

            </div>

            {/* --- MODAL CHAT TRỢ LÝ ẢO AI --- */}
            <ChatBoxAi isOpen={openAiChat} onClose={() => setOpenAiChat(false)} />
        </>
    );
}
