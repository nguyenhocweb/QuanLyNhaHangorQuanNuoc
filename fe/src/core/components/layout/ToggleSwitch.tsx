import React from 'react';

// Thêm tuỳ chọn màu sắc vào Props
interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
    disabled?: boolean;
    color?: 'blue' | 'green' | 'red'; // Chỉ cho phép 3 màu này
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
    checked, 
    onChange, 
    className = "", 
    disabled = false,
    color = 'blue' // Mặc định là màu xanh blue
}) => {
    
    // Hàm xác định màu nền khi nút được BẬT (checked = true)
    const getActiveColor = () => {
        switch (color) {
            case 'green': return 'bg-green-600'; // Màu xanh lá
            case 'red': return 'bg-red-600';     // Màu đỏ
            case 'blue': 
            default: return 'bg-[#002f87]';      // Màu xanh dương đậm của bạn
        }
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full
                border-2 border-transparent transition-colors duration-200 ease-in-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${checked ? getActiveColor() : 'bg-gray-300'} 
                ${className}
            `}
        >
            <span className="sr-only">Toggle setting</span>
            <span
                aria-hidden="true"
                className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
                    ${checked ? 'translate-x-5' : 'translate-x-0'}
                `}
            />
        </button>
    );
};

export default ToggleSwitch;