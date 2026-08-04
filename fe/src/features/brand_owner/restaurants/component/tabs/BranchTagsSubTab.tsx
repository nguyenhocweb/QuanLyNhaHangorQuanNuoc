import React, { useState } from "react";
import { FiTag, FiEdit3, FiX, FiSave, FiCheckCircle } from "react-icons/fi";
import { DynamicTag } from "./components/DynamicTag";
import { useGetAllTags } from "../../../../public/tags/hook/useGetAllTags";
import { useUpdateBranchTags } from "../../hook/tabs/useUpdateBranchTags";

interface BranchTagsSubTabProps {
    tags: any[];
    id_brand: string;
    id: string;
}

const BranchTagsSubTab: React.FC<BranchTagsSubTabProps> = ({ tags, id_brand, id }) => {
    const { data: allTags = [], isLoading: isLoadingAll } = useGetAllTags();
    const { mutate: updateBranchTags, isPending } = useUpdateBranchTags();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const openModal = () => {
        if (tags && tags.length > 0) {
            setSelectedIds(tags.map(t => typeof t === 'string' ? t : t.id));
        } else {
            setSelectedIds([]);
        }
        setIsModalOpen(true);
    };

    const toggleTag = (tagId: string) => {
        setSelectedIds(prev => 
            prev.includes(tagId) 
                ? prev.filter(id => id !== tagId) 
                : [...prev, tagId]
        );
    };

    const handleUpdate = () => {
        updateBranchTags({
            id_brand,
            id,
            payload: { tagIds: selectedIds }
        }, {
            onSuccess: () => {
                setIsModalOpen(false);
            }
        });
    };

    return (
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FiTag className="text-rose-500" /> Thẻ từ khóa (Tags)
                </h4>
                <button 
                    onClick={openModal}
                    className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2 rounded-xl font-bold transition-all"
                >
                    <FiEdit3 /> Cập nhật thẻ
                </button>
            </div>

            <div className="flex flex-wrap gap-3">
                {tags && tags.length > 0 ? (
                    tags.map((tag: any, idx: number) => (
                        <DynamicTag 
                            key={idx} 
                            text={tag.name || (typeof tag === 'string' ? tag : 'N/A')} 
                            icon={FiTag} 
                            defaultBg={tag.bgColor} 
                            defaultText={tag.textColor} 
                        />
                    ))
                ) : (
                    <div className="text-sm text-gray-500 italic py-2 w-full text-center">Chưa gắn thẻ từ khóa.</div>
                )}
            </div>

            {/* Modal Cập nhật */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Chọn thẻ từ khóa</h3>
                            <button onClick={() => !isPending && setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                                <FiX className="text-2xl" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            {isLoadingAll ? (
                                <div className="flex justify-center py-10">
                                    <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {allTags.map((tag: any) => {
                                        const isSelected = selectedIds.includes(tag.id);
                                        return (
                                            <div 
                                                key={tag.id}
                                                onClick={() => toggleTag(tag.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                    isSelected 
                                                        ? "font-semibold shadow-sm" 
                                                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                                                }`}
                                                style={isSelected ? { backgroundColor: tag.bgColor || '#fff1f2', color: tag.textColor || '#9f1239', borderColor: tag.textColor || '#f43f5e' } : {}}
                                            >
                                                {isSelected ? <FiCheckCircle style={{ color: tag.textColor || '#f43f5e' }} /> : <FiTag className="text-gray-400" />}
                                                <span>{tag.name}</span>
                                            </div>
                                        );
                                    })}
                                    
                                    {allTags.length === 0 && (
                                        <div className="w-full text-center text-gray-500 italic py-6">
                                            Hệ thống chưa có thẻ từ khóa nào.
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
                                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default BranchTagsSubTab;
