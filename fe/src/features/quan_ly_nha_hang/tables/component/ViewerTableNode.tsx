import React from "react";
import { FiUsers, FiStar } from "react-icons/fi";
import { cn } from "@/src/core/lib/tw";
import { TableOperationalStatus, TableType } from "../type/table.type";

interface ViewerTableNodeProps {
    table: TableType;
    onClick: (table: TableType) => void;
}

const ViewerTableNode: React.FC<ViewerTableNodeProps> = ({ table, onClick }) => {
    // Determine shape styles using clip-path
    const getInlineStyles = () => {
        let styles: React.CSSProperties = {};
        const shape = table.shape || "RECTANGLE";
        switch (shape) {
            case "CIRCLE": case "ROUND": case "OVAL": styles.borderRadius = "50%"; break;
            case "TRIANGLE": styles.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)"; break;
            case "HEXAGON": styles.clipPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"; break;
            case "STAR": styles.clipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"; break;
            default: break; 
        }
        return styles;
    };

    const getBgColor = () => {
        if (table.status === "MAINTENANCE" || table.operational_status === TableOperationalStatus.MAINTENANCE) return "bg-red-400 border-red-500 text-white";
        
        switch (table.operational_status) {
            case TableOperationalStatus.IN_USE:
                return "bg-indigo-500 border-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]";
            case TableOperationalStatus.RESERVED:
                return "bg-amber-400 border-amber-500 text-white";
            case TableOperationalStatus.CLEANING:
                return "bg-gray-400 border-gray-500 text-white";
            case TableOperationalStatus.AVAILABLE:
            default:
                return "bg-green-400 border-green-500 text-white shadow-sm";
        }
    };


    const isCustomShape = table.shape && ["TRIANGLE", "HEXAGON", "STAR"].includes(table.shape);

    return (
        <div
            className="absolute z-10 hover:z-20 group cursor-pointer"
            style={{
                left: table.pos_x || 0,
                top: table.pos_y || 0,
                width: table.width || 80,
                height: table.height || 80,
                transform: `rotate(${table.rotation || 0}deg)`,
            }}
            onClick={() => onClick(table)}
        >
            <div 
                className={cn(
                    "w-full h-full flex flex-col items-center justify-center transition-all",
                    !isCustomShape && "border-2 rounded-xl", 
                    getBgColor(),
                    "hover:shadow-lg hover:scale-105"
                )}
                style={getInlineStyles()}
            >
                <span className="font-bold text-sm select-none">{table.table_number}</span>
                <div className="flex items-center gap-1 text-[10px] font-medium opacity-90 select-none">
                    <FiUsers />
                    <span>{table.min_capacity === table.max_capacity ? table.max_capacity : `${table.min_capacity}-${table.max_capacity}`}</span>
                </div>
                {table.is_vip && <FiStar className="absolute -top-2 -right-2 text-yellow-300 fill-yellow-300 w-5 h-5 drop-shadow-sm" />}
            </div>

            {/* Hover tooltip for operational info */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-lg">
                {table.operational_status === TableOperationalStatus.AVAILABLE && "Bàn trống"}
                {table.operational_status === TableOperationalStatus.IN_USE && "Đang phục vụ"}
                {table.operational_status === TableOperationalStatus.RESERVED && "Đã đặt trước"}
                {table.operational_status === TableOperationalStatus.CLEANING && "Đợi dọn dẹp"}
                {(table.operational_status === TableOperationalStatus.MAINTENANCE || table.status === "MAINTENANCE") && "Bảo trì / Sửa chữa"}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>

        </div>
    );
};

export default ViewerTableNode;
