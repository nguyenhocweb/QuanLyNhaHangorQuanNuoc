"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PerformanceState {
    mode: "3D" | "2D";
    isLowEnd: boolean;
    isAutoDetected: boolean;
    setMode: (mode: "3D" | "2D") => void;
    toggleMode: () => void;
    detectHardware: () => void;
}

export const usePerformanceStore = create<PerformanceState>()(
    persist(
        (set, get) => ({
            mode: "3D",
            isLowEnd: false,
            isAutoDetected: false,
            setMode: (mode) => set({ mode, isAutoDetected: true }),
            toggleMode: () => set((state) => ({ 
                mode: state.mode === "3D" ? "2D" : "3D",
                isAutoDetected: true 
            })),
            detectHardware: () => {
                if (typeof window === "undefined") return;

                // Nếu người dùng đã tự chuyển chế độ hoặc đã từng detect trước đó và được lưu trong localStorage, không thay đổi mode của họ nữa
                if (get().isAutoDetected) return;

                // 1. Kiểm tra số nhân CPU
                const cores = navigator.hardwareConcurrency || 8;
                
                // 2. Kiểm tra chế độ giảm chuyển động của hệ điều hành
                const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                
                // 3. Kiểm tra thiết bị di động / màn hình cảm ứng cảm biến thấp
                const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
                const isSmallScreen = window.innerWidth < 768;

                // Nếu máy dưới 4 cores, hoặc bật giảm chuyển động, hoặc điện thoại màn hình nhỏ -> Tự động chuyển 2D Senior Pro Max
                const isWeak = cores <= 4 || prefersReducedMotion || (isTouchDevice && isSmallScreen);

                set({
                    isLowEnd: isWeak,
                    isAutoDetected: true,
                    mode: isWeak ? "2D" : "3D"
                });
            }
        }),
        {
            name: "performance-mode-storage", // Key lưu trong localStorage kề sát với auth-storage
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                mode: state.mode,
                isAutoDetected: state.isAutoDetected,
                isLowEnd: state.isLowEnd
            })
        }
    )
);

/**
 * Hook tiện ích gọi tự động nhận diện khi mount và trả về trạng thái hiển thị hiện tại
 */
export const usePerformanceMode = () => {
    const { mode, isLowEnd, isAutoDetected, setMode, toggleMode, detectHardware } = usePerformanceStore();

    useEffect(() => {
        if (!isAutoDetected) {
            detectHardware();
        }
    }, [isAutoDetected, detectHardware]);

    return {
        mode,
        is3D: mode === "3D",
        is2D: mode === "2D",
        isLowEnd,
        setMode,
        toggleMode
    };
};
