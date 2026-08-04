import React, { useState, useEffect, useRef } from "react";
import ViewerTableNode from "./ViewerTableNode";
import ViewerObstacleNode, { ObstacleItem } from "./ViewerObstacleNode";
import { AreaType, TableType } from "../type/table.type";
import FadeIn from "@/src/core/components/animation/FadeIn";

interface FloorPlanViewerProps {
    area: AreaType;
    onTableClick: (table: TableType) => void;
}

export const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({ area, onTableClick }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(0.8);
    const gridSize = 20;

    // Use area's actual width/height or defaults
    const canvasWidth = area?.width || 1200;
    const canvasHeight = area?.height || 800;
    const tables = area?.tables || [];
    const obstacles: ObstacleItem[] = Array.isArray(area?.obstacles) ? area.obstacles : [];

    // Automatically calculate optimal zoom to fit container on mount and resize
    useEffect(() => {
        const updateZoom = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                // Add some padding (e.g. 40px)
                const availableWidth = containerWidth - 40;
                
                // Calculate scale required to fit the width
                let scale = availableWidth / canvasWidth;
                
                // Cap the scale between 0.2 and 1.5
                scale = Math.min(Math.max(scale, 0.2), 1.5);
                setZoom(scale);
            }
        };

        updateZoom();
        window.addEventListener('resize', updateZoom);
        return () => window.removeEventListener('resize', updateZoom);
    }, [canvasWidth, area]);

    if (!tables || tables.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 w-full">
                <div className="text-4xl mb-4 opacity-50">🍽️</div>
                <p>Khu vực này hiện chưa có bàn nào.</p>
            </div>
        );
    }

    return (
        <FadeIn className="w-full flex-1 flex flex-col items-center">
            {/* Toolbar cho Viewer */}
            <div className="w-full flex justify-between items-center mb-4 px-2">
                <p className="text-sm text-gray-500">
                    Sơ đồ tổng quan tầng <span className="font-bold text-gray-700">{area?.name || area?.floor_number}</span>
                </p>
                <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200 shadow-sm">
                    <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="px-2 py-1 text-gray-600 hover:bg-white rounded transition-colors">-</button>
                    <span className="text-xs font-bold w-12 text-center text-gray-700">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="px-2 py-1 text-gray-600 hover:bg-white rounded transition-colors">+</button>
                </div>
            </div>

            {/* Canvas Area */}
            <div 
                ref={containerRef}
                className="w-full flex justify-center bg-gray-50 border border-gray-200 rounded-2xl relative shadow-inner p-4 overflow-auto"
                style={{ minHeight: '500px' }}
            >
                <div style={{ width: canvasWidth * zoom, height: canvasHeight * zoom, transition: 'all 0.2s ease-in-out' }}>
                    <div 
                        className="relative bg-white shadow-sm border border-gray-200 overflow-hidden origin-top-left transition-transform duration-200"
                        style={{
                            width: canvasWidth,
                            height: canvasHeight,
                            transform: `scale(${zoom})`,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='${gridSize}' height='${gridSize}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M ${gridSize} 0 L 0 0 0 ${gridSize}' fill='none' stroke='%23e5e7eb' stroke-width='1'/%3E%3C/svg%3E")`,
                            backgroundSize: `${gridSize}px ${gridSize}px`,
                        }}
                    >
                        {/* Background Image if available */}
                        {area?.background_url && (
                            <img 
                                src={area.background_url} 
                                alt="Floor Plan" 
                                className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" 
                            />
                        )}

                        {/* Obstacles */}
                        {obstacles.map(obs => (
                            <ViewerObstacleNode 
                                key={obs.id}
                                obstacle={obs}
                            />
                        ))}

                        {/* Tables */}
                        {tables.map(table => (
                            <ViewerTableNode 
                                key={table.id}
                                table={table}
                                onClick={onTableClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};
