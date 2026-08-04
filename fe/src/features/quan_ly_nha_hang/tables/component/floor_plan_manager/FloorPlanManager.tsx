import React, { useState, useEffect } from "react";
import FloorPlanDesigner from "./FloorPlanDesigner";
import AreaFormModal from "./AreaFormModal";
import TableFormModal from "./TableFormModal";
import ObstacleFormModal from "./ObstacleFormModal";

import { useCreateArea } from "../../hook/useCreateArea";
import { useUpdateArea } from "../../hook/useUpdateArea";
import { useDeleteArea } from "../../hook/useDeleteArea";
import { useCreateTable } from "../../hook/useCreateTable";
import { useUpdateTable } from "../../hook/useUpdateTable";
import { useDeleteTable } from "../../hook/useDeleteTable";
import { useSaveTableLayout } from "../../hook/useSaveTableLayout";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";

interface FloorPlanManagerProps {
    area: any;
    tables: any[];
}

const FloorPlanManager: React.FC<FloorPlanManagerProps> = ({ area: activeArea, tables: initialTables }) => {
    const activeWorkspace = useAuthStore.getState().activeWorkspace;
    const restaurantId = activeWorkspace?.id || "";
    const selectedAreaId = activeArea?.id;

    const createArea = useCreateArea();
    const updateArea = useUpdateArea();
    const deleteArea = useDeleteArea();

    const createTable = useCreateTable();
    const updateTable = useUpdateTable();
    const deleteTable = useDeleteTable();
    const saveTableLayout = useSaveTableLayout();

    const [localTables, setLocalTables] = useState<any[]>([]);
    const [localObstacles, setLocalObstacles] = useState<any[]>([]);

    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<any>(null);
    const [deletingTableId, setDeletingTableId] = useState<string | null>(null);

    const [isObstacleModalOpen, setIsObstacleModalOpen] = useState(false);
    const [editingObstacle, setEditingObstacle] = useState<any>(null);

    useEffect(() => {
        setLocalTables(initialTables || []);
    }, [initialTables]);

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

    const handleTableSubmit = (data: any) => {
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
        
        const tablePayload = localTables.map(t => ({
            id: t.id,
            pos_x: t.pos_x,
            pos_y: t.pos_y,
            rotation: t.rotation
        }));

        saveTableLayout.mutate({
            area_id: selectedAreaId,
            tables: tablePayload,
            obstacles: localObstacles
        });
    };

    return (
        <div className="w-full flex-1 min-w-0 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
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
                isSaving={saveTableLayout.isPending}
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
                open={!!deletingTableId}
                onClose={() => setDeletingTableId(null)}
                onConfirm={() => {
                    if (deletingTableId) {
                        deleteTable.mutate(deletingTableId, {
                            onSuccess: () => setDeletingTableId(null)
                        });
                    }
                }}
                title="Xóa Bàn"
                content="Bạn có chắc chắn muốn xóa bàn này không? Hành động này không thể hoàn tác."
                isLoading={deleteTable.isPending}
            />
        </div>
    );
};

export default FloorPlanManager;
