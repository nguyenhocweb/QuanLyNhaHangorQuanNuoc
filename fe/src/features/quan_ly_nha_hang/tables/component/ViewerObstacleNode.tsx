import React from "react";
import { cn } from "@/src/core/lib/tw";

export interface ObstacleItem {
    id: string;
    type: "WALL" | "DOOR" | "PLANT" | "TEXT" | "RECTANGLE" | "SQUARE" | "CIRCLE" | "OVAL" | "TRIANGLE" | "HEXAGON" | "STAR" | "LINE";
    pos_x: number;
    pos_y: number;
    width: number;
    height: number;
    rotation: number;
    text?: string;
    tooltip?: string;
    color?: string;
    textColor?: string;
    textDirection?: "horizontal" | "vertical";
}

interface ViewerObstacleNodeProps {
    obstacle: ObstacleItem;
}

const ViewerObstacleNode: React.FC<ViewerObstacleNodeProps> = ({ obstacle }) => {
    const getObstacleStyle = () => {
        let baseClass = "w-full h-full flex flex-col items-center justify-center overflow-hidden ";
        switch (obstacle.type) {
            case "WALL": return baseClass + "bg-slate-700 shadow-sm";
            case "DOOR": return baseClass + "bg-amber-600 border-2 border-amber-800 opacity-80";
            case "PLANT": return baseClass + "bg-emerald-500 shadow-inner border-2 border-emerald-700";
            case "TEXT": return baseClass + "bg-transparent font-bold";
            case "LINE": return baseClass + "bg-gray-800";
            default: return baseClass + "bg-gray-400 shadow-sm";
        }
    };

    const getInlineStyles = () => {
        let styles: React.CSSProperties = {};
        if (obstacle.color) {
            styles.backgroundColor = obstacle.color;
        }
        
        switch (obstacle.type) {
            case "CIRCLE": 
            case "PLANT":
            case "OVAL": 
                styles.borderRadius = "50%"; 
                break;
            case "TRIANGLE":
                styles.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
                break;
            case "HEXAGON":
                styles.clipPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
                break;
            case "STAR":
                styles.clipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
                break;
            case "SQUARE":
            case "RECTANGLE":
            case "WALL":
            case "DOOR":
                styles.borderRadius = "4px";
                break;
        }
        return styles;
    };

    return (
        <div
            className="absolute z-[5]"
            title={obstacle.tooltip || ""}
            style={{
                left: obstacle.pos_x,
                top: obstacle.pos_y,
                width: obstacle.width,
                height: obstacle.height,
                transform: `rotate(${obstacle.rotation || 0}deg)`,
            }}
        >
            <div 
                className={cn(getObstacleStyle())}
                style={getInlineStyles()}
            >
                {obstacle.text && (
                    <span 
                        className="pointer-events-none select-none text-xs text-center w-full h-full flex items-center justify-center"
                        style={{ 
                            color: obstacle.textColor || (obstacle.type === 'TEXT' ? (obstacle.color || '#1f2937') : '#ffffff'), 
                            textShadow: obstacle.type === 'TEXT' ? 'none' : '0 1px 2px rgba(0,0,0,0.5)',
                            writingMode: obstacle.textDirection === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
                            textOrientation: obstacle.textDirection === 'vertical' ? 'upright' : 'mixed',
                            whiteSpace: obstacle.textDirection === 'vertical' ? 'normal' : 'nowrap',
                            overflow: 'hidden'
                        }}
                    >
                        {obstacle.text}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ViewerObstacleNode;
