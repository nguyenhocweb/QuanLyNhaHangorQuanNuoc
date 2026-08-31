import React from "react";
import { FiLock } from "react-icons/fi";
import { toast } from "sonner";

export const DEFAULT_CORE_FEATURES = [
    'MENU_MANAGEMENT',
    'TABLE_MANAGEMENT',
    'ORDER_MANAGEMENT',
    'RESERVATION_ONLINE',
    'CUSTOMER_REVIEWS'
];

interface FeatureGateProps {
    children: React.ReactNode;
    featureKey?: string;
    featuresData?: Record<string, boolean> | null;
    className?: string;
    onLockClick?: () => void;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ children, featureKey, featuresData, className = "", onLockClick }) => {
    // 1. Không có featureKey hoặc thuộc nhóm TÍNH NĂNG CỐT LÕI MẶC ĐỊNH -> Luôn mở khóa 100%
    if (!featureKey || DEFAULT_CORE_FEATURES.includes(featureKey)) {
        return <>{children}</>;
    }

    // 2. Kiểm tra tính năng nâng cao trong gói cước
    const hasFeature = featuresData && featuresData[featureKey] === true;

    if (hasFeature) {
        return <>{children}</>;
    }

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onLockClick) {
            onLockClick();
        } else {
            toast.error("Tính năng nâng cao này yêu cầu nâng cấp gói cước để sử dụng.");
        }
    };

    return (
        <div 
            onClick={handleClick} 
            className={`relative group cursor-pointer opacity-60 hover:opacity-80 transition-opacity ${className}`}
            title="Tính năng nâng cao (Yêu cầu nâng cấp gói cước)"
        >
            <div className="pointer-events-none">
                {children}
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500 text-white p-1 rounded-md text-xs shadow">
                <FiLock className="w-3 h-3" />
            </div>
        </div>
    );
};
