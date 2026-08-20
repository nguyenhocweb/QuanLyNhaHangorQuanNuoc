import React, { useRef, useEffect, useState } from 'react';
import { FaChair } from 'react-icons/fa';
import { cn } from '@/src/core/lib/tw';

interface Obstacle {
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Table {
    id: string;
    table_number: string;
    shape: string;
    pos_x: number;
    pos_y: number;
    width: number | null;
    height: number | null;
    rotation: number | null;
    max_capacity: number;
    is_available: boolean;
    is_vip: boolean;
    current_status: 'AVAILABLE' | 'SEATED' | 'RESERVED' | 'CLEANING' | 'MAINTENANCE';
    unavailability_reason?: string;
}

interface AreaProps {
    area: {
        id: string;
        name: string;
        width: number;
        height: number;
        obstacles: Obstacle[];
        tables: Table[];
    };
    selectedTableIds: string[];
    onSelectTable: (table: Table) => void;
    variant?: 'default' | 'luxury' | 'immersive' | 'zen' | 'hotpot' | 'sushi';
}

const FloorPlanRenderer: React.FC<AreaProps> = ({ area, selectedTableIds, onSelectTable, variant = 'default' }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const isLuxury = variant === 'luxury';
    const isHotpot = variant === 'hotpot' || variant === 'sushi';

    // Responsive scaling to fit the container
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const padding = 40;
                const availableWidth = containerWidth - padding;
                const newScale = Math.min(1, availableWidth / area.width);
                setScale(newScale);
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [area.width]);

    const getTableShapeStyle = (shape: string) => {
        switch(shape) {
            case 'ROUND': return 'rounded-full';
            case 'SQUARE': return 'rounded-2xl';
            case 'RECT': 
            case 'LONG':
            case 'RECTANGLE': return 'rounded-2xl';
            default: return 'rounded-2xl';
        }
    };

    const getStatusStyles = (status: string, isVip: boolean, isSelected: boolean) => {
        if (isSelected) {
            if (isLuxury) {
                return "bg-[#0a0a0a] border-4 border-yellow-600 shadow-xl z-20 scale-110 text-yellow-600";
            }
            if (isHotpot) {
                return "bg-[#2D1414] border-4 border-[#D32F2F] shadow-xl z-20 scale-110 text-white";
            }
            return "bg-white border-4 border-indigo-600 shadow-xl z-20 scale-110 text-indigo-700";
        }

        const baseVip = isVip ? "ring-2 ring-yellow-400 ring-offset-1" : (isLuxury || isHotpot ? "border border-[#444]" : "border border-white/20");
        
        switch(status) {
            case 'AVAILABLE':
                return `bg-[#00C853] text-white shadow-md hover:shadow-lg hover:scale-105 cursor-pointer ${baseVip}`;
            case 'SEATED':
                return `bg-[#2962FF] text-white shadow-md opacity-80 cursor-not-allowed ${baseVip}`;
            case 'RESERVED':
                return `bg-[#FFB300] text-white shadow-md opacity-80 cursor-not-allowed ${baseVip}`;
            case 'CLEANING':
                return `bg-[#9E9E9E] text-white shadow-md opacity-80 cursor-not-allowed ${baseVip}`;
            case 'MAINTENANCE':
                return `bg-[#FF5252] text-white shadow-md opacity-80 cursor-not-allowed ${baseVip}`;
            default:
                return isLuxury || isHotpot
                    ? "bg-[#222] border-2 border-[#444] opacity-60 cursor-not-allowed text-zinc-500"
                    : "bg-gray-100 border-2 border-gray-300 opacity-60 cursor-not-allowed text-gray-400";
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Legend (Chú thích 5 trạng thái chuẩn) */}
            <div className={cn(
                "flex flex-wrap gap-4 items-center justify-center p-4 rounded-xl text-sm font-medium mt-2 shadow-sm",
                isLuxury ? "bg-[#0a0a0a] border border-[#222] text-zinc-300" : 
                isHotpot ? "bg-[#1A1A1A] border border-[#333333] text-[#E0E0E0]" : 
                "bg-white border border-gray-100 text-gray-700"
            )}>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#00C853]"></div>
                    <span>Trống</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#2962FF]"></div>
                    <span>Đang phục vụ</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#FFB300]"></div>
                    <span>Đã đặt</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#9E9E9E]"></div>
                    <span>Đợi dọn</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#FF5252]"></div>
                    <span>Bảo trì</span>
                </div>
                <div className={cn("h-6 w-px mx-2", isLuxury || isHotpot ? "bg-[#333]" : "bg-gray-300")}></div>
                <div className="flex items-center gap-2">
                    <div className={cn("w-4 h-4 rounded-full border ring-2 ring-yellow-400 ring-offset-1", isLuxury || isHotpot ? "border-[#444]" : "border-gray-300")}></div>
                    <span>Viền vàng: Bàn VIP</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={cn("w-4 h-4 rounded-full border-4 scale-110", isLuxury ? "border-yellow-600" : isHotpot ? "border-[#D32F2F]" : "border-indigo-600")}></div>
                    <span>Đang chọn</span>
                </div>
            </div>

            <div 
                ref={containerRef} 
                className={cn("w-full flex justify-center overflow-x-hidden py-8 relative rounded-xl", isLuxury ? "bg-[#111]" : isHotpot ? "bg-[#1A1A1A]" : "bg-gray-50")}
                style={{ minHeight: `${(area.height * scale) + 80}px` }}
            >
                <div 
                    className={cn(
                        "relative shadow-sm border-2 border-dashed rounded-lg",
                        isLuxury ? "bg-[#1a1a1a] border-[#333]" : isHotpot ? "bg-[#222222] border-[#444444]" : "bg-white border-gray-300"
                    )}
                    style={{
                        width: `${area.width}px`,
                        height: `${area.height}px`,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                    }}
                >
                    {/* Render Obstacles */}
                {area.obstacles?.map((obs, idx) => (
                    <div 
                        key={`obs-${idx}`}
                        className={`absolute flex items-center justify-center text-[10px] font-bold shadow-sm tracking-widest
                            ${obs.type === 'WALL' ? (isLuxury || isHotpot ? 'bg-[#333] text-transparent' : 'bg-slate-300 text-transparent') : 
                              obs.type === 'DOOR' ? (isLuxury || isHotpot ? 'bg-amber-900/30 border border-amber-900 text-amber-500' : 'bg-amber-100 border border-amber-300 text-amber-700') : 
                              obs.type === 'PLANT' ? (isLuxury || isHotpot ? 'bg-emerald-900/30 border border-emerald-900 rounded-full text-emerald-500' : 'bg-emerald-100 border border-emerald-300 rounded-full text-emerald-700') : 
                              (isLuxury || isHotpot ? 'bg-[#222]' : 'bg-gray-200')}`
                        }
                        style={{
                            left: `${obs.x}px`,
                            top: `${obs.y}px`,
                            width: `${obs.width}px`,
                            height: `${obs.height}px`,
                        }}
                    >
                        {obs.type === 'DOOR' ? 'CỬA' : obs.type === 'PLANT' ? 'CÂY' : ''}
                    </div>
                ))}

                {/* Render Tables */}
                {area.tables?.map((table) => {
                    const isSelected = selectedTableIds.includes(table.id);
                    const shapeClass = getTableShapeStyle(table.shape);
                    const statusClass = getStatusStyles(table.current_status || 'AVAILABLE', table.is_vip, isSelected);
                    const width = table.width || (table.shape === 'ROUND' ? 80 : 100);
                    const height = table.height || (table.shape === 'ROUND' ? 80 : 100);

                    return (
                        <button
                            key={table.id}
                            disabled={!table.is_available}
                            onClick={() => onSelectTable(table)}
                            className={`absolute flex flex-col items-center justify-center transition-all duration-200
                                ${shapeClass} ${statusClass}`}
                            style={{
                                left: `${table.pos_x}px`,
                                top: `${table.pos_y}px`,
                                width: `${width}px`,
                                height: `${height}px`,
                                transform: `rotate(${table.rotation || 0}deg)`
                            }}
                            title={table.unavailability_reason || `Bàn ${table.table_number}`}
                        >
                            <span className="font-bold drop-shadow-sm text-inherit">
                                {table.table_number}
                            </span>
                            <div className="text-[10px] flex items-center gap-1 drop-shadow-sm text-inherit opacity-90">
                                <FaChair /> {table.max_capacity}
                            </div>
                        </button>
                    );
                })}
            </div>
            </div>
        </div>
    );
};

export default FloorPlanRenderer;
