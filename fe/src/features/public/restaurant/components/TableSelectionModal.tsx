import React, { useEffect, useState } from 'react';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';
import { useGetAvailableTables } from '../hook/useGetAvailableTables';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import FloorPlanRenderer from './FloorPlanRenderer';
import { cn } from '@/src/core/lib/tw';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    idRestaurant: string;
    draftData: any;
    onConfirmTable: (tableId: string, tableNumber: string) => void;
    variant?: 'default' | 'luxury';
}

const TableSelectionModal: React.FC<Props> = ({ isOpen, onClose, idRestaurant, draftData, onConfirmTable, variant = 'default' }) => {
    const queryClient = useQueryClient();
    const [selectedTables, setSelectedTables] = useState<any[]>([]);
    const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
    const isLuxury = variant === 'luxury';

    const { data: areas, isLoading } = useGetAvailableTables(idRestaurant, isOpen ? draftData : null);

    useEffect(() => {
        if (!isOpen) return;
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';
        const socket = io(socketUrl, { transports: ['websocket'] });
        
        socket.on('table_status_changed', (payload: any) => {
            if (payload.restaurantId === idRestaurant) {
                queryClient.invalidateQueries({ queryKey: ["PUBLIC_AVAILABLE_TABLES", idRestaurant] });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [isOpen, idRestaurant, queryClient]);

    // Auto-select first area when data loads
    useEffect(() => {
        if (areas && areas.length > 0 && !selectedAreaId) {
            setSelectedAreaId(areas[0].id);
        }
    }, [areas, selectedAreaId]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (selectedTables.length > 0) {
            const tableIds = selectedTables.map(t => t.id).join(',');
            const tableNumbers = selectedTables.map(t => t.table_number).join(', ');
            onConfirmTable(tableIds, tableNumbers);
        }
    };

    const handleSelectTable = (table: any) => {
        setSelectedTables(prev => {
            const exists = prev.find(t => t.id === table.id);
            if (exists) {
                return prev.filter(t => t.id !== table.id); // Toggle off
            }
            return [...prev, table]; // Add new table
        });
    };

    const totalCapacity = selectedTables.reduce((sum, t) => sum + (t.max_capacity || 0), 0);
    const hasEnoughCapacity = totalCapacity >= draftData.partySize;

    const activeArea = areas?.find((a: any) => a.id === selectedAreaId);

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={cn(
                "rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[95vh] font-sans",
                isLuxury ? "bg-[#111] border border-[#333]" : "bg-white"
            )}>
                {/* Header */}
                <div className={cn(
                    "flex items-center justify-between px-6 py-4 border-b flex-shrink-0",
                    isLuxury ? "border-[#222] bg-[#0a0a0a] text-yellow-600" : "border-gray-100 bg-indigo-600 text-white"
                )}>
                    <div>
                        <h3 className="text-xl font-bold">Chọn Vị Trí Bàn</h3>
                        <p className={cn("text-sm mt-1", isLuxury ? "text-zinc-400" : "text-indigo-200")}>
                            {draftData.date} | {draftData.time} - {draftData.endTime} | {draftData.partySize} người
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className={cn(
                            "transition-colors p-2 rounded-full",
                            isLuxury ? "text-zinc-500 hover:text-zinc-300 hover:bg-[#222]" : "text-white hover:text-indigo-200 hover:bg-indigo-700"
                        )}
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className={cn(
                    "flex-1 overflow-y-auto flex flex-col scrollbar-thin",
                    isLuxury ? "bg-[#1a1a1a] [color-scheme:dark] scrollbar-thumb-zinc-700 scrollbar-track-transparent" : "bg-gray-50 scrollbar-thumb-gray-300"
                )}>
                    {isLoading ? (
                        <div className="flex justify-center items-center flex-1 py-20">
                            <div className={cn("w-10 h-10 border-4 rounded-full animate-spin", isLuxury ? "border-yellow-900 border-t-yellow-600" : "border-indigo-200 border-t-indigo-600")}></div>
                        </div>
                    ) : areas && areas.length > 0 ? (
                        <>
                            {/* Area Selector */}
                            <div className={cn(
                                "flex items-center justify-between px-6 py-4 border-b",
                                isLuxury ? "bg-[#111] border-[#333]" : "bg-white border-gray-200"
                            )}>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="area-select" className={cn("font-semibold", isLuxury ? "text-zinc-300" : "text-gray-700")}>Chọn Khu vực / Tầng:</label>
                                    <select
                                        id="area-select"
                                        value={selectedAreaId || ''}
                                        onChange={(e) => setSelectedAreaId(e.target.value)}
                                        className={cn(
                                            "border-2 rounded-lg px-4 py-2 font-bold focus:outline-none focus:ring-0 cursor-pointer min-w-[200px]",
                                            isLuxury 
                                                ? "bg-[#0a0a0a] border-[#333] text-yellow-600 focus:border-yellow-600" 
                                                : "bg-indigo-50 border-indigo-100 text-indigo-800 focus:border-indigo-400"
                                        )}
                                    >
                                        {areas.map((area: any) => (
                                            <option key={area.id} value={area.id} className={isLuxury ? "bg-[#111] text-zinc-300" : ""}>
                                                {area.name} ({area.tables?.length || 0} bàn)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <div className={cn(
                                    "flex items-center gap-2 text-sm p-3 rounded-lg mb-4 border",
                                    isLuxury ? "bg-yellow-900/20 text-yellow-600 border-yellow-900/50" : "bg-indigo-50 text-indigo-700 border-indigo-100"
                                )}>
                                    <FaInfoCircle className="flex-shrink-0" />
                                    <span>Bạn có thể thu phóng và chọn bàn trực tiếp trên sơ đồ. Bàn xám là bàn đang bận hoặc không đủ chỗ.</span>
                                </div>
                                
                                {/* Floor Plan */}
                                {activeArea && (
                                    <div className={cn(
                                        "flex-1 border rounded-xl overflow-hidden",
                                        isLuxury ? "border-[#333] bg-[#222]" : "border-gray-200 bg-white"
                                    )}>
                                        <FloorPlanRenderer 
                                            area={activeArea} 
                                            selectedTableIds={selectedTables.map(t => t.id)} 
                                            onSelectTable={handleSelectTable} 
                                            variant={variant}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className={cn("flex-1 flex items-center justify-center py-20 text-center", isLuxury ? "text-zinc-500" : "text-gray-500")}>
                            Không tìm thấy sơ đồ bàn nào!
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={cn(
                    "border-t p-6 flex justify-between items-center flex-shrink-0 z-10",
                    isLuxury ? "bg-[#111] border-[#222]" : "bg-white border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]"
                )}>
                    <div className="flex flex-col">
                        <span className={isLuxury ? "text-zinc-400" : "text-gray-700 font-medium"}>
                            Đang chọn: <span className={cn("font-bold text-lg ml-1", isLuxury ? "text-yellow-600" : "text-indigo-700")}>
                                {selectedTables.length > 0 ? selectedTables.map(t => `Bàn ${t.table_number}`).join(', ') : 'Chưa chọn'}
                            </span>
                        </span>
                        <span className={cn(
                            "text-sm mt-1",
                            hasEnoughCapacity 
                                ? (isLuxury ? "text-green-500 font-semibold" : "text-green-600 font-semibold") 
                                : "text-orange-500"
                        )}>
                            Sức chứa: {totalCapacity} / {draftData.partySize} người
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            className={cn(
                                "px-6 py-2.5 rounded-xl font-medium border transition-colors",
                                isLuxury ? "bg-[#222] border-[#333] text-zinc-300 hover:bg-[#333]" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            Quay lại
                        </button>
                        <button 
                            type="button"
                            onClick={handleConfirm}
                            disabled={!hasEnoughCapacity}
                            className={cn(
                                "px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-none",
                                isLuxury 
                                    ? "bg-yellow-600 text-black shadow-[0_4px_14px_0_rgba(202,138,4,0.39)] hover:shadow-[0_6px_20px_rgba(202,138,4,0.23)] hover:bg-yellow-500 hover:-translate-y-0.5"
                                    : "bg-indigo-600 text-white shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:bg-indigo-700 hover:-translate-y-0.5"
                            )}
                        >
                            {hasEnoughCapacity ? 'Tiếp tục điền thông tin' : 'Chưa đủ chỗ'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableSelectionModal;
