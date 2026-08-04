import React, { useState, useEffect } from "react";
import TableNode, { TableItem } from "./TableNode";
import { Button } from "@/src/core/components/ui";
import { FiSave, FiPlus, FiSquare, FiList, FiImage, FiType } from "react-icons/fi";
import ObstacleNode, { ObstacleItem } from "./ObstacleNode";

interface FloorPlanDesignerProps {
    area: any;
    tables: TableItem[];
    onTableUpdate: (id: string, x: number, y: number) => void;
    onAddTable: () => void;
    onEditTable: (table: TableItem) => void;
    onRemoveTable?: (id: string) => void;
    onSaveLayout: () => void;
    isSaving?: boolean;
    obstacles?: ObstacleItem[];
    onObstaclesChange?: (obstacles: ObstacleItem[]) => void;
    onEditObstacle?: (obstacle: ObstacleItem) => void;
    onResizeObstacle?: (id: string, width: number, height: number) => void;
}

const FloorPlanDesigner: React.FC<FloorPlanDesignerProps> = ({
    area,
    tables,
    onTableUpdate,
    onAddTable,
    onEditTable,
    onRemoveTable,
    onSaveLayout,
    isSaving,
    obstacles = [],
    onObstaclesChange,
    onEditObstacle,
    onResizeObstacle
}) => {
    // Dynamic Grid Background using SVG
    const gridSize = 20;
    const canvasWidth = area?.width || 1200;
    const canvasHeight = area?.height || 800;
    const [zoom, setZoom] = useState(0.8); // Mặc định thu nhỏ 80% cho laptop
    const [isObstacleMenuOpen, setIsObstacleMenuOpen] = useState(false);

    const renderShapePreview = (type: string) => {
        let styles: any = { backgroundColor: "#9ca3af" };
        let className = "w-4 h-4 shrink-0 shadow-sm ";
        switch (type) {
            case "CIRCLE": case "OVAL": case "PLANT": styles.borderRadius = "50%"; break;
            case "TRIANGLE": styles.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)"; break;
            case "HEXAGON": styles.clipPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"; break;
            case "STAR": styles.clipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"; break;
            case "LINE": className = "w-4 h-1 mt-1.5 shrink-0 "; break;
            case "RECTANGLE": case "WALL": case "DOOR": className = "w-5 h-3 mt-0.5 shrink-0 "; break;
            case "TEXT": styles.backgroundColor = "transparent"; className = "w-4 h-4 flex items-center justify-center font-bold text-[10px] text-gray-500 shrink-0"; return <div className={className} style={styles}>T</div>;
        }
        return <div className={className} style={styles} />;
    };

    const handleAddObstacle = (type: any) => {
        let defaultWidth = 40;
        let defaultHeight = 40;

        switch (type) {
            case "RECTANGLE":
            case "OVAL":
                defaultWidth = 80;
                defaultHeight = 40;
                break;
            case "WALL":
                defaultWidth = 100;
                defaultHeight = 20;
                break;
            case "DOOR":
                defaultWidth = 60;
                defaultHeight = 20;
                break;
            case "LINE":
                defaultWidth = 100;
                defaultHeight = 4;
                break;
            case "TEXT":
                defaultWidth = 100;
                defaultHeight = 30;
                break;
            // SQUARE, CIRCLE, TRIANGLE, HEXAGON, STAR, PLANT remain 40x40
        }

        const newObstacle: ObstacleItem = {
            id: `obs_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            type,
            pos_x: 50,
            pos_y: 50,
            width: defaultWidth,
            height: defaultHeight,
            rotation: 0,
        };
        onObstaclesChange?.([...obstacles, newObstacle]);
        setIsObstacleMenuOpen(false);
    };

    const handleObstacleUpdate = (id: string, x: number, y: number) => {
        onObstaclesChange?.(obstacles.map(obs => obs.id === id ? { ...obs, pos_x: x, pos_y: y } : obs));
    };

    const handleObstacleRemove = (id: string) => {
        onObstaclesChange?.(obstacles.filter(obs => obs.id !== id));
    };

    return (
        <div className="w-full h-full flex flex-col min-w-0 max-w-full">
            {/* Toolbar */}
            <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-gray-800">
                        Sơ đồ: <span className="text-green-600">{area?.name || "Khu vực trống"}</span>
                    </h3>
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                        <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))} className="px-2.5 py-1 text-gray-600 hover:bg-white hover:shadow-sm rounded transition-all">-</button>
                        <span className="text-xs font-bold w-12 text-center text-gray-700">{Math.round(zoom * 100)}%</span>
                        <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="px-2.5 py-1 text-gray-600 hover:bg-white hover:shadow-sm rounded transition-all">+</button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Add Obstacles Dropdown */}
                    <div className="relative">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsObstacleMenuOpen(!isObstacleMenuOpen)} 
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                        >
                            <FiSquare /> Thêm Vật Cản
                        </Button>
                        
                        {isObstacleMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-xl p-3 z-50">
                                <p className="text-xs font-semibold text-gray-500 mb-2 px-1">CHỌN HÌNH DÁNG</p>
                                <div className="grid grid-cols-2 gap-1">
                                    <button onClick={() => handleAddObstacle("RECTANGLE")} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors font-medium text-gray-700">
                                        {renderShapePreview("RECTANGLE")} Hình Chữ nhật
                                    </button>
                                    <button onClick={() => handleAddObstacle("SQUARE")} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors font-medium text-gray-700">
                                        {renderShapePreview("SQUARE")} Hình Vuông
                                    </button>
                                    <button onClick={() => handleAddObstacle("CIRCLE")} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors font-medium text-gray-700">
                                        {renderShapePreview("CIRCLE")} Hình Tròn
                                    </button>
                                    <button onClick={() => handleAddObstacle("OVAL")} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors font-medium text-gray-700">
                                        {renderShapePreview("OVAL")} Hình Oval
                                    </button>
                                    <button onClick={() => handleAddObstacle("TRIANGLE")} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors font-medium text-gray-700">
                                        {renderShapePreview("TRIANGLE")} Tam giác
                                    </button>
                                    <button onClick={() => handleAddObstacle("HEXAGON")} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors font-medium text-gray-700">
                                        {renderShapePreview("HEXAGON")} Lục giác
                                    </button>
                                    <button onClick={() => handleAddObstacle("STAR")} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors font-medium text-gray-700">
                                        {renderShapePreview("STAR")} Ngôi sao
                                    </button>
                                    <button onClick={() => handleAddObstacle("LINE")} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors font-medium text-gray-700">
                                        {renderShapePreview("LINE")} Đường kẻ
                                    </button>
                                    <button onClick={() => handleAddObstacle("WALL")} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors font-medium text-gray-700">
                                        {renderShapePreview("WALL")} Tường
                                    </button>
                                    <button onClick={() => handleAddObstacle("DOOR")} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors font-medium text-gray-700">
                                        {renderShapePreview("DOOR")} Cửa ra vào
                                    </button>
                                    <button onClick={() => handleAddObstacle("PLANT")} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors font-medium text-gray-700">
                                        {renderShapePreview("PLANT")} Cây cảnh
                                    </button>
                                    <button onClick={() => handleAddObstacle("TEXT")} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors font-medium text-gray-700">
                                        {renderShapePreview("TEXT")} Chỉ có Text
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button variant="outline" onClick={onAddTable} className="flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                        <FiPlus /> Thêm Bàn
                    </Button>
                    <Button variant="green" onClick={onSaveLayout} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                        <FiSave /> {isSaving ? "Đang lưu..." : "Lưu Sơ Đồ"}
                    </Button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="w-full flex-1 min-w-0 overflow-auto bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl relative shadow-inner p-4">
                <div style={{ width: canvasWidth * zoom, height: canvasHeight * zoom, margin: "0 auto" }}>
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
                        <ObstacleNode 
                            key={obs.id}
                            obstacle={obs}
                            gridSize={gridSize}
                            scale={zoom}
                            onDragStop={handleObstacleUpdate}
                            onRemove={handleObstacleRemove}
                            onEdit={(obs) => onEditObstacle?.(obs)}
                            onResize={(id, w, h) => onResizeObstacle?.(id, w, h)}
                        />
                    ))}

                    {/* Tables */}
                    {tables.map(table => (
                        <TableNode 
                            key={table.id}
                            table={table}
                            gridSize={gridSize}
                            scale={zoom}
                            onDragStop={onTableUpdate}
                            onClick={onEditTable}
                            onRemove={onRemoveTable}
                        />
                    ))}

                    {tables.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <p className="text-gray-400 font-medium text-lg">Chưa có bàn nào. Nhấn "Thêm Bàn" để bắt đầu thiết kế.</p>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </div>
    );
};

export default FloorPlanDesigner;
