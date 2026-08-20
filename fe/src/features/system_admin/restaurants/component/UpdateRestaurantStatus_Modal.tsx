"use client";
import { useState, useEffect } from "react";
import { Button } from "@/src/core/components/ui";
import { useUpdateRestaurant } from "../hook/useUpdateRestaurant_hook";


interface UpdateRestaurantStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    restaurant: any;
}

const UpdateRestaurantStatusModal = ({ isOpen, onClose, restaurant }: UpdateRestaurantStatusModalProps) => {
    const [newAdminStatus, setNewAdminStatus] = useState<string>('PENDING');
    const [adminUpdateReason, setAdminUpdateReason] = useState<string>('');

    const { mutate: updateRestaurant, isPending: isUpdating } = useUpdateRestaurant();

    useEffect(() => {
        if (isOpen && restaurant) {
            setNewAdminStatus(restaurant.statusByAdmin || 'PENDING');
            setAdminUpdateReason(restaurant.reasonByAdmin || '');
        }
    }, [isOpen, restaurant]);

    const handleUpdateStatusSubmit = () => {
        if (!restaurant || !adminUpdateReason.trim()) return;
        updateRestaurant({
            id: restaurant.id,
            statusByAdmin: newAdminStatus,
            reasonByAdmin: adminUpdateReason
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    if (!isOpen || !restaurant) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Cập nhật trạng thái</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái mới</label>
                        <select 
                            value={newAdminStatus}
                            onChange={(e) => setNewAdminStatus(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[14px]"
                        >
                            <option value="PENDING">Chờ duyệt</option>
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Tạm ngưng</option>
                            <option value="TERMINATED">Nghỉ vĩnh viễn</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lý do cập nhật <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={adminUpdateReason}
                            onChange={(e) => setAdminUpdateReason(e.target.value)}
                            placeholder="Nhập lý do thay đổi trạng thái... (bắt buộc)"
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[14px] min-h-[100px] resize-none"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button 
                            variant="outline" 
                            onClick={onClose} 
                            className="rounded-xl px-5 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-[14px] font-medium"
                        >
                            Hủy
                        </Button>
                        <Button 
                            onClick={handleUpdateStatusSubmit} 
                            disabled={isUpdating || !adminUpdateReason.trim()}
                            className={`rounded-xl px-5 py-2.5 text-white text-[14px] font-medium ${
                                isUpdating || !adminUpdateReason.trim() 
                                ? 'bg-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateRestaurantStatusModal;
