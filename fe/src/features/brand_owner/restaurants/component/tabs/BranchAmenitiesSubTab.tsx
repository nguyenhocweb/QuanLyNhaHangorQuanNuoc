import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiSave, FiEdit3, FiX } from "react-icons/fi";
import * as FiIcons from "react-icons/fi";
import { useGetAllAmenities } from "../../../../public/amenities/hook/useGetAllAmenities";
import { useUpdateBranchAmenities } from "../../hook/tabs/useUpdateBranchAmenities";

interface BranchAmenitiesSubTabProps {
    amenities: any[];
    id_brand: string;
    id: string;
}

const BranchAmenitiesSubTab: React.FC<BranchAmenitiesSubTabProps> = ({ amenities, id_brand, id }) => {
    const { data: allAmenities = [], isLoading: isLoadingAll } = useGetAllAmenities();
    const { mutate: updateBranchAmenities, isPending } = useUpdateBranchAmenities();

    const [isModalOpen, setIsModalOpen] = useState(false);
    // State lưu mảng ID các tiện ích được chọn trong modal
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Mở modal và set lại state ban đầu
    const openModal = () => {
        if (amenities && amenities.length > 0) {
            setSelectedIds(amenities.map(a => a.id));
        } else {
            setSelectedIds([]);
        }
        setIsModalOpen(true);
    };

    const toggleAmenity = (amenityId: string) => {
        setSelectedIds(prev => 
            prev.includes(amenityId) 
                ? prev.filter(id => id !== amenityId) 
                : [...prev, amenityId]
        );
    };

    const handleUpdate = () => {
        updateBranchAmenities({
            id_brand,
            id,
            payload: { amenityIds: selectedIds }
        }, {
            onSuccess: () => {
                setIsModalOpen(false);
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" /> Quản lý Tiện ích dịch vụ
                </h4>
                <button 
                    onClick={openModal}
                    className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-5 py-2 rounded-xl font-bold transition-all"
                >
                    <FiEdit3 /> Cập nhật tiện ích
                </button>
            </div>

            {/* Hiển thị các tiện ích hiện tại */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {amenities && amenities.length > 0 ? (
                    amenities.map((amenity: any) => (
                        <div key={amenity.id} className="flex items-center gap-3 p-4 rounded-xl border-2 bg-green-50 border-green-200 text-green-800">
                            <div className="flex items-center justify-center w-6 h-6 rounded border bg-green-500 border-green-500">
                                <FiCheckCircle className="text-white text-sm" />
                            </div>
                            <div className="flex-1 font-semibold text-sm flex items-center gap-2">
                                {amenity.icon && (() => {
                                    const IconComponent = (FiIcons as any)[amenity.icon];
                                    return IconComponent ? <IconComponent className="text-xl text-green-600" /> : null;
                                })()}
                                <span>{amenity.name}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 text-center text-gray-500 italic py-6">
                        Nhà hàng chưa có tiện ích nào.
                    </div>
                )}
            </div>

            {/* Modal Cập nhật */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Chọn tiện ích dịch vụ</h3>
                            <button onClick={() => !isPending && setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                                <FiX className="text-2xl" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            {isLoadingAll ? (
                                <div className="flex justify-center py-10">
                                    <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {allAmenities.map((amenity: any) => {
                                        const isSelected = selectedIds.includes(amenity.id);
                                        return (
                                            <div 
                                                key={amenity.id}
                                                onClick={() => toggleAmenity(amenity.id)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                    isSelected 
                                                        ? "bg-green-50 border-green-500 text-green-800" 
                                                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                                                }`}
                                            >
                                                <div className={`flex items-center justify-center w-5 h-5 rounded border ${isSelected ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`}>
                                                    {isSelected && <FiCheckCircle className="text-white text-xs" />}
                                                </div>
                                                <div className="flex-1 font-semibold text-sm flex items-center gap-2">
                                                    {amenity.icon && (() => {
                                                        const IconComponent = (FiIcons as any)[amenity.icon];
                                                        return IconComponent ? <IconComponent className={`text-xl ${isSelected ? 'text-green-600' : 'text-gray-400'}`} /> : null;
                                                    })()}
                                                    <span>{amenity.name}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {allAmenities.length === 0 && (
                                        <div className="col-span-2 text-center text-gray-500 italic py-6">
                                            Hệ thống chưa có tiện ích nào.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                disabled={isPending}
                                className="px-5 py-2 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-all"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={handleUpdate}
                                disabled={isPending}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Đang lưu...</span>
                                    </>
                                ) : (
                                    <><FiSave /> Lưu thay đổi</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchAmenitiesSubTab;
