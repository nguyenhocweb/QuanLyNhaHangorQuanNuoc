import React, { useState, useRef } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { FiUsers, FiStar, FiX } from "react-icons/fi";
import { cn } from "@/src/core/lib/tw";

export interface TableItem {
    id: string;
    table_number: string;
    table_type: string;
    min_capacity: number;
    max_capacity: number;
    is_vip: boolean;
    pos_x: number;
    pos_y: number;
    width: number;
    height: number;
    rotation: number;
    status: string;
    shape?: string;
    color?: string;
}

interface TableNodeProps {
    table: TableItem;
    onDragStop: (id: string, x: number, y: number) => void;
    onClick: (table: TableItem) => void;
    onRemove?: (id: string) => void;
    gridSize?: number;
    scale?: number;
}

const TableNode: React.FC<TableNodeProps> = ({ table, onDragStop, onClick, onRemove, gridSize = 20, scale = 1 }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    // Keep local position state for smooth dragging visually, but update parent on stop
    const [isDragging, setIsDragging] = useState(false);

    const handleStop = (e: DraggableEvent, data: DraggableData) => {
        setIsDragging(false);
        onDragStop(table.id, data.x, data.y);
    };

    // Determine shape styles using clip-path
    const getInlineStyles = () => {
        let styles: React.CSSProperties = {};
        const shape = table.shape || (table.table_type === "ROUND" ? "CIRCLE" : "RECTANGLE");
        switch (shape) {
            case "CIRCLE": case "ROUND": case "OVAL": styles.borderRadius = "50%"; break;
            case "TRIANGLE": styles.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)"; break;
            case "HEXAGON": styles.clipPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"; break;
            case "STAR": styles.clipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"; break;
            default: break; // RECTANGLE, SQUARE, LONG, RECT use default rounded-xl if we don't apply specific clip-path
        }
        return styles;
    };

    const getBgColor = () => {
        // Trạng thái hư hỏng/bảo trì ưu tiên cao nhất
        if (table.status === "MAINTENANCE") return "bg-red-100 border-red-400 text-red-800";
        if (table.status === "INACTIVE") return "bg-gray-200 border-gray-400 text-gray-600";
        
        // Màu sắc cố định, đặc trưng cho từng LOẠI BÀN để nhìn là biết ngay
        switch (table.table_type) {
            case "VIP": 
                return "bg-gradient-to-br from-amber-200 to-yellow-400 border-yellow-500 text-yellow-900 shadow-[0_0_15px_rgba(250,204,21,0.4)]";
            case "BAR_SEATING": 
                return "bg-indigo-100 border-indigo-400 text-indigo-800";
            case "SOFA": 
                return "bg-pink-100 border-pink-400 text-pink-800";
            case "PRIVATE_ROOM": 
                return "bg-purple-100 border-purple-400 text-purple-800";
            case "OUTDOOR": 
                return "bg-emerald-100 border-emerald-400 text-emerald-800";
            case "STANDARD":
            default: 
                return "bg-blue-50 border-blue-300 text-blue-700";
        }
    };

    const isCustomShape = table.shape && ["TRIANGLE", "HEXAGON", "STAR"].includes(table.shape);

    return (
        <Draggable
            nodeRef={nodeRef}
            bounds="parent"
            grid={[gridSize, gridSize]}
            scale={scale}
            defaultPosition={{ x: table.pos_x || 0, y: table.pos_y || 0 }}
            onStart={() => setIsDragging(true)}
            onStop={handleStop}
        >
            <div
                ref={nodeRef}
                className="absolute cursor-grab active:cursor-grabbing z-10 hover:z-20 group"
                style={{
                    width: table.width || 80,
                    height: table.height || 80,
                    transform: `rotate(${table.rotation || 0}deg)`,
                }}
            >
                {/* Table Shape Element */}
                <div 
                    className={cn(
                        "w-full h-full flex flex-col items-center justify-center transition-all",
                        !isCustomShape && "border-2 rounded-xl shadow-sm", // Apply default border only for non-clip-path shapes
                        getBgColor(),
                        isDragging ? "shadow-lg scale-105" : "shadow-sm hover:shadow-md"
                    )}
                    style={getInlineStyles()}
                    onDoubleClick={(e) => {
                        e.stopPropagation();
                        onClick(table);
                    }}
                >
                    <span className="font-bold text-sm select-none">{table.table_number}</span>
                    <div className="flex items-center gap-1 text-[10px] font-medium opacity-80 select-none">
                        <FiUsers />
                        <span>{table.min_capacity === table.max_capacity ? table.max_capacity : `${table.min_capacity}-${table.max_capacity}`}</span>
                    </div>
                    {table.is_vip && <FiStar className="absolute -top-2 -right-2 text-amber-500 fill-amber-500 w-5 h-5 drop-shadow-sm" />}
                </div>

                {/* Actions Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                    <span className="text-white text-xs font-medium px-2 py-1 bg-black/60 rounded">Đúp click để sửa</span>
                </div>
                
                {/* Delete Button */}
                {onRemove && (
                    <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onRemove(table.id); }} 
                            className="p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 hover:scale-110 transition-all"
                            title="Xóa bàn"
                        >
                            <FiX size={10} />
                        </button>
                    </div>
                )}
            </div>
        </Draggable>
    );
};

export default TableNode;
