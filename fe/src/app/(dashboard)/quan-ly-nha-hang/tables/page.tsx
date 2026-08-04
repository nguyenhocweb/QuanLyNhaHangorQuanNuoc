"use client"

import React, { useState, useEffect } from 'react';
import { Div, H, P, Button } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { useGetAreasWithTables } from '@/src/features/quan_ly_nha_hang/tables/hook/useGetAreasWithTables';
import { TableAreaTabs } from '@/src/features/quan_ly_nha_hang/tables/component/TableAreaTabs';
import { FloorPlanViewer } from '@/src/features/quan_ly_nha_hang/tables/component/FloorPlanViewer';
import FloorPlanManager from '@/src/features/quan_ly_nha_hang/tables/component/floor_plan_manager/FloorPlanManager';
import AreaFormModal from '@/src/features/quan_ly_nha_hang/tables/component/floor_plan_manager/AreaFormModal';
import { useCreateArea } from '@/src/features/quan_ly_nha_hang/tables/hook/useCreateArea';
import { useUpdateArea } from '@/src/features/quan_ly_nha_hang/tables/hook/useUpdateArea';
import { useDeleteArea } from '@/src/features/quan_ly_nha_hang/tables/hook/useDeleteArea';
import { ConfirmModal } from '@/src/core/components/layout/public-ConfirmModal';
import { TableOperationalStatus, TableType } from '@/src/features/quan_ly_nha_hang/tables/type/table.type';
import { FiPlus, FiEdit3, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaTools } from 'react-icons/fa';
import CreateTableMaintenanceModal from '@/src/features/quan_ly_nha_hang/table_maintenance/component/CreateTableMaintenanceModal';
import TableMaintenanceList from '@/src/features/quan_ly_nha_hang/table_maintenance/component/TableMaintenanceList';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import useRealtimeUpdates from '@/src/core/hooks/useRealtimeUpdates';

export default function TablesPage() {
    const { data: areasResponse, isLoading, isError } = useGetAreasWithTables();
    const [activeAreaId, setActiveAreaId] = useState<string>('');
    const { user, activeWorkspace } = useAuthStore();
    useRealtimeUpdates(activeWorkspace?.id);
    const userRole = typeof user?.role === 'object' ? user?.role?.name : user?.role;
    const canManageTables = user?.permissions?.includes('MANAGE_TABLES') || userRole === 'Quản lý nhà hàng' || userRole === 'Admin' || userRole === 'Chủ thương hiệu';

    const areas = areasResponse?.data || [];

    const allAvailableTables = areas.flatMap((area: any) => 
        (area.tables || []).map((t: any) => ({
            id: t.id,
            table_number: t.table_number,
            area_name: area.name || `Tầng ${area.floor_number}`
        }))
    );


    const [isEditMode, setIsEditMode] = useState(false);
    const [viewMode, setViewMode] = useState<"MAP" | "MAINTENANCE">("MAP");
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
    
    // Modals for Area
    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);

    const [editingArea, setEditingArea] = useState<any>(null);
    const [deletingAreaId, setDeletingAreaId] = useState<string | null>(null);

    const createArea = useCreateArea();
    const updateArea = useUpdateArea();
    const deleteArea = useDeleteArea();

    useEffect(() => {
        if (areas && areas.length > 0 && !activeAreaId) {
            setActiveAreaId(areas[0].id);
        }
    }, [areas, activeAreaId]);

    const handleTableClick = (table: TableType) => {
        if (isEditMode) return; // Không click được khi đang ở chế độ chỉnh sửa
        console.log("Clicked table:", table);
        // Mở Drawer thao tác tương ứng tại đây
    };

    const handleAreaSubmit = (data: any) => {
        if (editingArea) {
            updateArea.mutate({ id: editingArea.id, payload: data }, {
                onSuccess: () => { setIsAreaModalOpen(false); setEditingArea(null); }
            });
        } else {
            createArea.mutate({ ...data, restaurantId: activeWorkspace?.id }, {
                onSuccess: (res: any) => { 
                    setIsAreaModalOpen(false); 
                    if (res?.data?.id) setActiveAreaId(res.data.id);
                }
            });
        }
    };

    return (
        <>
            <FadeIn className="w-full h-full p-4 md:p-6 bg-gray-50/50 min-h-screen">
            <Div vitri="col_none" className="w-full max-w-7xl mx-auto" gap="g5_6" shape="none">
                
                {/* Header Block */}
                <Div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm" shape="none">
                    <Div vitri="col_none" shape="none">
                        <H variant="text_black" className="text-2xl font-bold text-gray-800">
                            Sơ đồ Bàn & Bảo trì
                        </H>
                        <P className="text-gray-500 text-sm mt-1">
                            Quản lý sơ đồ bàn, tình trạng hoạt động và lịch bảo trì sửa chữa
                        </P>
                    </Div>
                    
                    {canManageTables && (
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setViewMode("MAP")}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                        viewMode === "MAP" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
                                    }`}
                                >
                                    Sơ đồ bàn
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode("MAINTENANCE")}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                                        viewMode === "MAINTENANCE" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
                                    }`}
                                >
                                    <FaTools className="w-3.5 h-3.5" /> Lịch bảo trì
                                </button>
                            </div>

                            <Button 
                                variant="outline"
                                sizea="p3_2" 
                                onClick={() => setIsMaintenanceModalOpen(true)}
                                className="rounded-xl font-semibold shadow-sm flex items-center gap-2 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                            >
                                <FaTools /> + Lên lịch bảo trì
                            </Button>

                            {viewMode === "MAP" && (
                                <Button 
                                    variant={isEditMode ? "gray" : "outline"}
                                    sizea="p3_2" 
                                    onClick={() => setIsEditMode(!isEditMode)}
                                    className="rounded-xl font-semibold shadow-sm flex items-center gap-2"
                                >
                                    {isEditMode ? <><FiX /> Xong thiết kế</> : <><FiEdit3 /> Thiết kế sơ đồ</>}
                                </Button>
                            )}
                            
                            {isEditMode && viewMode === "MAP" && (
                                <Button 
                                    variant="green" 
                                    sizea="p3_2" 
                                    onClick={() => { setEditingArea(null); setIsAreaModalOpen(true); }}
                                    className="rounded-xl font-semibold shadow-sm text-white px-5 gap-2"
                                >
                                    <FiPlus className="text-lg" />
                                    Thêm Khu vực
                                </Button>
                            )}
                        </div>
                    )}
                </Div>

                {/* Chú thích trạng thái (Legend) */}
                {viewMode === "MAP" && (
                    <Div className="w-full flex flex-wrap gap-4 px-2" shape="none">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400"></div><span className="text-sm text-gray-600">Trống</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span className="text-sm text-gray-600">Đang phục vụ</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div><span className="text-sm text-gray-600">Đã đặt</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-400"></div><span className="text-sm text-gray-600">Đợi dọn</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div><span className="text-sm text-gray-600">Bảo trì</span></div>
                    </Div>
                )}

                {/* Content Block */}
                {viewMode === "MAINTENANCE" ? (
                    <TableMaintenanceList restaurantId={activeWorkspace?.id || ""} />
                ) : (
                    <Div vitri="col_none" className="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[500px]" gap="g5_6" shape="none">
                        {isLoading ? (
                            <div className="w-full h-64 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <>
                                {/* Tabs khu vực */}
                                <div className="flex items-center justify-between">
                                    <TableAreaTabs 
                                        areas={areas} 
                                        activeAreaId={activeAreaId} 
                                        onChange={setActiveAreaId} 
                                    />
                                    {isEditMode && activeAreaId && (
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button 
                                                variant="outline" 
                                                onClick={() => { setEditingArea(areas.find(a => a.id === activeAreaId)); setIsAreaModalOpen(true); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
                                            >
                                                <FiEdit2 size={14} /> Sửa
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => setDeletingAreaId(activeAreaId)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                                            >
                                                <FiTrash2 size={14} /> Xóa
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Sơ đồ Bàn */}
                                <div className="w-full pt-4 flex">
                                    {areas.find(a => a.id === activeAreaId) ? (
                                        isEditMode ? (
                                            <FloorPlanManager 
                                                area={areas.find(a => a.id === activeAreaId)!}
                                                tables={areas.find(a => a.id === activeAreaId)!.tables || []}
                                            />
                                        ) : (
                                            <FloorPlanViewer 
                                                area={areas.find(a => a.id === activeAreaId)!}
                                                onTableClick={handleTableClick} 
                                            />
                                        )
                                    ) : null}
                                </div>
                            </>
                        )}
                    </Div>
                )}

            </Div>
        </FadeIn>
            
            <AreaFormModal 
                open={isAreaModalOpen} 
                onClose={() => { setIsAreaModalOpen(false); setEditingArea(null); }} 
                initialData={editingArea}
                onSubmit={handleAreaSubmit}
                isLoading={createArea.isPending || updateArea.isPending}
            />

            <ConfirmModal 
                open={!!deletingAreaId}
                onClose={() => setDeletingAreaId(null)}
                onConfirm={() => {
                    if (deletingAreaId) {
                        deleteArea.mutate(deletingAreaId, {
                            onSuccess: () => {
                                setDeletingAreaId(null);
                                setActiveAreaId(""); // Reset active area
                            }
                        });
                    }
                }}
                title="Xóa Khu Vực"
                content="Bạn có chắc chắn muốn xóa khu vực này không? Tất cả bàn thuộc khu vực này sẽ bị xóa. Hành động này không thể hoàn tác."
                isLoading={deleteArea.isPending}
            />

            <CreateTableMaintenanceModal
                open={isMaintenanceModalOpen}
                onClose={() => setIsMaintenanceModalOpen(false)}
                restaurantId={activeWorkspace?.id || ""}
                availableTables={allAvailableTables}
            />
        </>
    );
}

