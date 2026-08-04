import React, { useState, useRef } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { cn } from "@/src/core/lib/tw";
import { FiX, FiEdit2 } from "react-icons/fi";

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

interface ObstacleNodeProps {
    obstacle: ObstacleItem;
    onDragStop: (id: string, x: number, y: number) => void;
    onRemove: (id: string) => void;
    onEdit: (obstacle: ObstacleItem) => void;
    onResize?: (id: string, width: number, height: number) => void;
    gridSize?: number;
    scale?: number;
}

const ObstacleNode: React.FC<ObstacleNodeProps> = ({ obstacle, onDragStop, onRemove, onEdit, onResize, gridSize = 20, scale = 1 }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    
    // State for local resizing
    const [size, setSize] = useState({ width: obstacle.width || 40, height: obstacle.height || 40 });
    const sizeRef = useRef(size);

    React.useEffect(() => {
        setSize({ width: obstacle.width || 40, height: obstacle.height || 40 });
        sizeRef.current = { width: obstacle.width || 40, height: obstacle.height || 40 };
    }, [obstacle.width, obstacle.height]);

    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = sizeRef.current.width;
        const startHeight = sizeRef.current.height;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const dx = (moveEvent.clientX - startX) / scale;
            const dy = (moveEvent.clientY - startY) / scale;
            const newWidth = Math.max(10, Math.round(startWidth + dx));
            const newHeight = Math.max(10, Math.round(startHeight + dy));
            
            setSize({ width: newWidth, height: newHeight });
            sizeRef.current = { width: newWidth, height: newHeight };
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            onResize?.(obstacle.id, sizeRef.current.width, sizeRef.current.height);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleStop = (e: DraggableEvent, data: DraggableData) => {
        setIsDragging(false);
        onDragStop(obstacle.id, data.x, data.y);
    };

    const getObstacleStyle = () => {
        let baseClass = "w-full h-full flex flex-col items-center justify-center transition-all overflow-hidden ";
        switch (obstacle.type) {
            case "WALL": return baseClass + "bg-slate-700 shadow-md";
            case "DOOR": return baseClass + "bg-amber-600 border-2 border-amber-800 opacity-80";
            case "PLANT": return baseClass + "bg-emerald-500 shadow-inner border-2 border-emerald-700";
            case "TEXT": return baseClass + "bg-transparent text-gray-800 font-bold";
            case "LINE": return baseClass + "bg-gray-800";
            default: return baseClass + "bg-gray-500 shadow-md";
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
                styles.borderRadius = "50%"; 
                break;
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
            case "LINE":
                // Line is just a very thin rectangle
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
        <Draggable
            nodeRef={nodeRef}
            position={{ x: obstacle.pos_x, y: obstacle.pos_y }}
            grid={[gridSize, gridSize]}
            scale={scale}
            onStart={() => setIsDragging(true)}
            onStop={(e, data) => {
                setIsDragging(false);
                onDragStop(obstacle.id, data.x, data.y);
            }}
            cancel=".resize-handle"
        >
            <div
                ref={nodeRef}
                className="absolute cursor-grab active:cursor-grabbing z-[5] group"
                title={obstacle.tooltip || ""}
                style={{
                    width: size.width,
                    height: size.height,
                    transform: `rotate(${obstacle.rotation || 0}deg)`,
                }}
            >
                <div 
                    className={cn(
                        getObstacleStyle(),
                        isDragging ? "shadow-xl scale-105" : "hover:shadow-lg"
                    )}
                    style={getInlineStyles()}
                >
                    {obstacle.text && (
                        <span className="pointer-events-none select-none text-xs text-center w-full h-full flex items-center justify-center"
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

                {/* Các nút thao tác hiện lên khi hover */}
                <div className="absolute -top-3 -right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button
                        className="bg-blue-500 text-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(obstacle);
                        }}
                    >
                        <FiEdit2 size={10} />
                    </button>
                    <button
                        className="bg-red-500 text-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(obstacle.id);
                        }}
                    >
                        <FiX size={10} />
                    </button>
                </div>

                {/* Nút Resize ở góc dưới phải */}
                <div 
                    className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-white cursor-se-resize rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md hover:scale-125"
                    onMouseDown={handleResizeStart}
                />
            </div>
        </Draggable>
    );
};

export default ObstacleNode;
