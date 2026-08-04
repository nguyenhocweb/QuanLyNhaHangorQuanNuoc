import React, { useState, useEffect } from "react";
import { FiGrid, FiSave, FiEdit3, FiX } from "react-icons/fi";
import { useGetPublicCategories } from "@/src/features/public/categories/hook/useGetPublicCategories";
import { useUpdateBranchCategories } from "../../hook/tabs/useUpdateBranchCategories";

interface BranchCategoriesSubTabProps {
    categories: any[];
    id_brand: string;
    id: string;
}

const BranchCategoriesSubTab: React.FC<BranchCategoriesSubTabProps> = ({ categories, id_brand, id }) => {
    // Fetch all categories from public endpoint (returns all active categories)
    const { data: allCategoriesResponse, isLoading: isLoadingAll } = useGetPublicCategories();
    const allCategories = allCategoriesResponse?.data || [];
    
    const { mutate: updateBranchCategories, isPending } = useUpdateBranchCategories();

    const [isModalOpen, setIsModalOpen] = useState(false);
    // State lưu mảng ID các danh mục được chọn trong modal
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Mở modal và set lại state ban đầu
    const openModal = () => {
        if (categories && categories.length > 0) {
            setSelectedIds(categories.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
        setIsModalOpen(true);
    };

    const toggleCategory = (categoryId: string) => {
        setSelectedIds(prev => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId) 
                : [...prev, categoryId]
        );
    };

    const handleUpdate = () => {
        updateBranchCategories({
            id_brand,
            id,
            payload: { categoryIds: selectedIds }
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
                    <FiGrid className="text-green-500" /> Phân loại nhà hàng (Danh mục)
                </h4>
                <button 
                    onClick={openModal}
                    className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-5 py-2 rounded-xl font-bold transition-all"
                >
                    <FiEdit3 /> Cập nhật danh mục
                </button>
            </div>

            {/* Hiển thị các danh mục hiện tại */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories && categories.length > 0 ? (
                    categories.map((cat: any) => (
                        <div 
                            key={cat.id} 
                            className="flex items-center gap-3 p-4 rounded-xl border-2"
                            style={{ 
                                backgroundColor: cat.bgColor || '#f0fdf4',
                                borderColor: cat.textColor || cat.bgColor || '#bbf7d0',
                                color: cat.textColor || '#166534'
                            }}
                        >
                            <div className="flex-1 font-semibold text-sm flex items-center gap-2">
                                <FiGrid className="text-lg" style={{ color: cat.textColor || '#16a34a' }} />
                                <span>{cat.name}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 italic py-6">
                        Nhà hàng chưa được gắn danh mục nào.
                    </div>
                )}
            </div>

            {/* Modal Cập nhật */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Chọn danh mục nhà hàng</h3>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {allCategories.map((cat: any) => {
                                        const isSelected = selectedIds.includes(cat.id);
                                        return (
                                            <div 
                                                key={cat.id}
                                                onClick={() => toggleCategory(cat.id)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                    isSelected 
                                                        ? "" 
                                                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                                                }`}
                                                style={isSelected ? {
                                                    backgroundColor: cat.bgColor || '#f0fdf4',
                                                    borderColor: cat.textColor || cat.bgColor || '#22c55e',
                                                    color: cat.textColor || '#166534'
                                                } : {}}
                                            >
                                                <div className="flex-1 font-semibold text-sm flex items-center gap-2">
                                                    <span>{cat.name}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {allCategories.length === 0 && (
                                        <div className="col-span-full text-center text-gray-500 italic py-6">
                                            Hệ thống chưa có danh mục nào.
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

export default BranchCategoriesSubTab;
