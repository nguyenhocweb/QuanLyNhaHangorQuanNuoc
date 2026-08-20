import React, { useState } from "react";
import { FiLock, FiKey } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { UpgradeBrandAccountModal } from "@/src/features/customer/profile/components/UpgradeBrandAccountModal";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";

interface FeatureGateProps {
    children: React.ReactNode;
    featureKey?: string;
    featuresData?: Record<string, boolean>;
    className?: string;
    onLockClick?: () => void;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ children, featureKey, featuresData, className = "", onLockClick }) => {
    const pathname = usePathname();
    const { user } = useAuthStore();

    if (!featureKey) {
        return <>{children}</>;
    }

    const hasFeature = featuresData && featuresData[featureKey] === true;

    if (hasFeature) {
        return <>{children}</>;
    }

    return (
        <div 
            className={`relative group flex flex-col w-full rounded-xl cursor-not-allowed transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 hover:shadow-lg hover:scale-[1.03] active:scale-95 ${className}`}
            onClickCapture={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onLockClick) {
                    onLockClick();
                }
            }}
        >
            {/* Lớp hiển thị nội dung gốc: Hoàn toàn bình thường, chỉ chặn tương tác để nhường hover cho thẻ cha */}
            <div 
                className="pointer-events-none select-none w-full"
                tabIndex={-1} 
                aria-hidden="true"
            >
                {children}
            </div>
            
            {/* Huy hiệu Góc trên cùng bên phải (Top-Right Badge) */}
            <div className="absolute top-0 right-0 z-10 flex items-start justify-end">
                {/* Badge thiết kế như một chiếc kẹp niêm phong góc */}
                <div className="relative z-20 flex items-center justify-center bg-gradient-to-br from-white to-amber-50 rounded-bl-xl rounded-tr-xl p-1.5 shadow-[0_2px_6px_rgba(245,158,11,0.2)] border-b border-l border-amber-200 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                    <FiLock className="text-amber-500 text-xs drop-shadow-sm" />
                </div>
            </div>
        </div>
    );
};
