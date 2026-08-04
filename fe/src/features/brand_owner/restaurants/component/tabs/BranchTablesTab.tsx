"use client";
import React, { useState, useEffect } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useParams } from "next/navigation";
import { FiPlus, FiGrid, FiTrash2, FiEdit2 } from "react-icons/fi";
import { Button } from "@/src/core/components/ui";

import FloorPlanDesigner from "./floor_plan/FloorPlanDesigner";
import AreaFormModal from "./floor_plan/AreaFormModal";
import TableFormModal from "./floor_plan/TableFormModal";
import ObstacleFormModal from "./floor_plan/ObstacleFormModal";

import { useGetAreas, useCreateArea, useUpdateArea, useDeleteArea } from "../../hook/useArea";
import { useGetTables, useCreateTable, useUpdateTable, useDeleteTable, useSaveTableLayout } from "../../hook/useTable";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import useRealtimeUpdates from "@/src/core/hooks/useRealtimeUpdates";

const BranchTablesTab: React.FC = () => {
    const params = useParams();
    const restaurantId = params.id as string;
    useRealtimeUpdates(restaurantId);

    // ----- Hooks -----
    const { data: areasData, isLoading: isLoadingAreas } = useGetAreas(restaurantId);
    const createArea = useCreateArea(restaurantId);
    const updateArea = useUpdateArea(restaurantId);
    const deleteArea = useDeleteArea(restaurantId);

    const areas = areasData?.data?.data || [];
    
    // State
    const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
    const [localTables, setLocalTables] = useState<any[]>([]);
    const [localObstacles, setLocalObstacles] = useState<any[]>([]);

    // Modals state
    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
    const [editingArea, setEditingArea] = useState<any>(null);
    const [deletingAreaId, setDeletingAreaId] = useState<string | null>(null);

    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<any>(null);
    const [deletingTableId, setDeletingTableId] = useState<string | null>(null);

    const [isObstacleModalOpen, setIsObstacleModalOpen] = useState(false);
    const [editingObstacle, setEditingObstacle] = useState<any>(null);

    // Auto select first area
    useEffect(() => {
        if (areas.length > 0 && !selectedAreaId) {
            setSelectedAreaId(areas[0].id);
        }
    }, [areas, selectedAreaId]);

    // ----- Table Hooks -----
    const { data: tablesData, isLoading: isLoadingTables } = useGetTables(selectedAreaId || "");
    const createTable = useCreateTable(selectedAreaId || "");
    const updateTable = useUpdateTable(selectedAreaId || "");
    const deleteTable = useDeleteTable(selectedAreaId || "");
    const saveTableLayout = useSaveTableLayout(selectedAreaId || "");

    useEffect(() => {
        if (tablesData?.data?.data) {
            setLocalTables(tablesData.data.data);
        }
    }, [tablesData]);

    const activeArea = areas.find((a: any) => a.id === selectedAreaId);

    // Sync obstacles when area changes
    useEffect(() => {
        if (activeArea?.obstacles) {
            try {
                const parsed = typeof activeArea.obstacles === 'string' 
                    ? JSON.parse(activeArea.obstacles) 
                    : activeArea.obstacles;
                setLocalObstacles(parsed || []);
            } catch (e) {
                setLocalObstacles([]);
            }
        } else {
            setLocalObstacles([]);
        }
    }, [activeArea]);

    // ----- Handlers -----
    const handleAreaSubmit = (data: any) => {
        if (editingArea) {
            updateArea.mutate({ id: editingArea.id, payload: data }, {
                onSuccess: () => { setIsAreaModalOpen(false); setEditingArea(null); }
            });
        } else {
            createArea.mutate({ ...data, restaurantId }, {
                onSuccess: (res: any) => { 
                    setIsAreaModalOpen(false); 
                    if (res?.data?.data?.id) setSelectedAreaId(res.data.data.id);
                }
            });
        }
    };

    const handleTableSubmit = (data: any) => {
        // Loại bỏ các trường rỗng tránh lỗi Validator phía Backend
        if (data.shape === "") delete data.shape;
        if (data.color === "") delete data.color;

        if (editingTable) {
            updateTable.mutate({ id: editingTable.id, payload: data }, {
                onSuccess: () => { setIsTableModalOpen(false); setEditingTable(null); }
            });
        } else {
            createTable.mutate({ ...data, restaurantId, areaId: selectedAreaId }, {
                onSuccess: () => { setIsTableModalOpen(false); }
            });
        }
    };

    const handleObstacleSubmit = (data: any) => {
        if (editingObstacle) {
            setLocalObstacles(prev => prev.map(obs => 
                obs.id === editingObstacle.id ? { ...obs, ...data } : obs
            ));
            setIsObstacleModalOpen(false);
            setEditingObstacle(null);
        }
    };

    const handleObstacleResize = (id: string, width: number, height: number) => {
        setLocalObstacles(prev => prev.map(obs => 
            obs.id === id ? { ...obs, width, height } : obs
        ));
    };

    const handleTableDragStop = (id: string, x: number, y: number) => {
        setLocalTables(prev => prev.map(t => t.id === id ? { ...t, pos_x: x, pos_y: y } : t));
    };

    const handleSaveLayout = () => {
        if (!selectedAreaId) return;
        
        // 1. Lưu vị trí bàn
        const tablePayload = localTables.map(t => ({
            id: t.id,
            pos_x: t.pos_x,
            pos_y: t.pos_y,
            rotation: t.rotation
        }));
        saveTableLayout.mutate(tablePayload);

        // 2. Lưu vật cản vào Area
        if (activeArea) {
            updateArea.mutate({
                id: selectedAreaId,
                payload: { obstacles: localObstacles }
            });
        }
    };

    return (
        <FadeIn className="w-full flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)] min-h-[600px] min-w-0 max-w-full">
            {/* Sidebar: Area List */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-4 overflow-y-auto pr-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-lg">Khu vực</h3>
                    <Button 
                        variant="green" 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                        onClick={() => { setEditingArea(null); setIsAreaModalOpen(true); }}
                    >
                        <FiPlus /> Thêm
                    </Button>
                </div>

                {isLoadingAreas ? (
                    <div className="flex justify-center p-4"><div className="animate-spin w-6 h-6 border-2 border-green-500 rounded-full border-t-transparent"></div></div>
                ) : areas.length === 0 ? (
                    <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-sm text-gray-500">Chưa có khu vực nào.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {areas.map((area: any) => (
                            <div 
                                key={area.id}
                                onClick={() => setSelectedAreaId(area.id)}
                                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${selectedAreaId === area.id ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedAreaId === area.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <FiGrid />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-semibold text-sm ${selectedAreaId === area.id ? 'text-green-700' : 'text-gray-700'}`}>{area.name}</span>
                                        <span className="text-[10px] text-gray-400">Tầng {area.floor_number}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button 
                                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                        onClick={(e) => { e.stopPropagation(); setEditingArea(area); setIsAreaModalOpen(true); }}
                                    >
                                        <FiEdit2 size={14} />
                                    </button>
                                    <button 
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        onClick={(e) => { e.stopPropagation(); setDeletingAreaId(area.id); }}
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 min-w-0 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                {!selectedAreaId ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <FiGrid className="text-4xl text-gray-300 mb-4" />
                        <h4 className="text-lg font-bold text-gray-700">Chưa chọn khu vực</h4>
                        <p className="text-gray-500 text-sm">Vui lòng chọn hoặc tạo mới một khu vực để bắt đầu thiết kế sơ đồ bàn.</p>
                    </div>
                ) : isLoadingTables ? (
                     <div className="flex justify-center items-center h-full"><div className="animate-spin w-8 h-8 border-2 border-green-500 rounded-full border-t-transparent"></div></div>
                ) : (
                    <FloorPlanDesigner 
                        area={activeArea}
                        tables={localTables}
                        obstacles={localObstacles}
                        onObstaclesChange={setLocalObstacles}
                        onEditObstacle={(obs) => { setEditingObstacle(obs); setIsObstacleModalOpen(true); }}
                        onResizeObstacle={handleObstacleResize}
                        onTableUpdate={handleTableDragStop}
                        onAddTable={() => { setEditingTable(null); setIsTableModalOpen(true); }}
                        onEditTable={(table) => { setEditingTable(table); setIsTableModalOpen(true); }}
                        onRemoveTable={(id) => setDeletingTableId(id)}
                        onSaveLayout={handleSaveLayout}
                        isSaving={saveTableLayout.isPending || updateArea.isPending}
                    />
                )}
            </div>

            {/* Modals */}
            <AreaFormModal 
                open={isAreaModalOpen} 
                onClose={() => { setIsAreaModalOpen(false); setEditingArea(null); }} 
                initialData={editingArea}
                onSubmit={handleAreaSubmit}
                isLoading={createArea.isPending || updateArea.isPending}
            />

            <TableFormModal 
                open={isTableModalOpen} 
                onClose={() => { setIsTableModalOpen(false); setEditingTable(null); }} 
                initialData={editingTable}
                onSubmit={handleTableSubmit}
                isLoading={createTable.isPending || updateTable.isPending}
            />

            <ObstacleFormModal 
                open={isObstacleModalOpen}
                onClose={() => { setIsObstacleModalOpen(false); setEditingObstacle(null); }}
                initialData={editingObstacle}
                onSubmit={handleObstacleSubmit}
            />

            <ConfirmModal 
                open={!!deletingAreaId}
                onClose={() => setDeletingAreaId(null)}
                onConfirm={() => {
                    if (deletingAreaId) {
                        deleteArea.mutate(deletingAreaId, {
                            onSuccess: () => {
                                setDeletingAreaId(null);
                                if (selectedAreaId === deletingAreaId) setSelectedAreaId(null);
                            }
                        });
                    }
                }}
                title="Xóa khu vực"
                content="Bạn có chắc chắn muốn xóa khu vực này? Tất cả các bàn trong khu vực này cũng sẽ bị vô hiệu hóa."
                type="danger"
            />

            <ConfirmModal 
                open={!!deletingTableId}
                onClose={() => setDeletingTableId(null)}
                onConfirm={() => {
                    if (deletingTableId) {
                        deleteTable.mutate(deletingTableId, {
                            onSuccess: () => {
                                setDeletingTableId(null);
                            }
                        });
                    }
                }}
                title="Xóa Bàn"
                content="Bạn có chắc chắn muốn xóa bàn này khỏi hệ thống? Dữ liệu không thể khôi phục."
                type="danger"
            />
        </FadeIn>
    );
};

export default BranchTablesTab;
