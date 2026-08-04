import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FiCheckCircle } from "react-icons/fi";
import { useGetRestaurantUtilities } from "../../hook/useGetRestaurantUtilities";

import BranchCategoriesSubTab from "./BranchCategoriesSubTab";
import BranchAmenitiesSubTab from "./BranchAmenitiesSubTab";
import BranchTagsSubTab from "./BranchTagsSubTab";

interface BranchUtilitiesTabProps {
    id_brand: string;
    id: string;
}

const BranchUtilitiesTab: React.FC<BranchUtilitiesTabProps> = ({ id_brand, id }) => {
    const { data: utilities, isLoading: isUtilitiesLoading } = useGetRestaurantUtilities(id_brand, id);
    const [activeSubTab, setActiveSubTab] = useState<'categories' | 'amenities' | 'tags'>('categories');

    return (
        <FadeIn className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
            <div className="flex flex-col items-center justify-center text-center mb-10">
                <div className="w-16 h-16 bg-green-50 text-green-500 flex items-center justify-center rounded-full mb-4">
                    <FiCheckCircle className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Quản lý tiện ích & Danh mục</h3>
                <p className="text-gray-500 text-sm max-w-md">Các thông tin hiển thị với khách hàng giúp nhà hàng nổi bật hơn.</p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-8">
                {isUtilitiesLoading ? (
                    <div className="flex justify-center py-6">
                        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="w-full">
                        {/* Inner Tabs Navigation */}
                        <div className="flex gap-4 mb-6 border-b border-gray-100 pb-2">
                            <button 
                                onClick={() => setActiveSubTab('categories')}
                                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeSubTab === 'categories' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Danh mục
                            </button>
                            <button 
                                onClick={() => setActiveSubTab('amenities')}
                                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeSubTab === 'amenities' ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Tiện ích
                            </button>
                            <button 
                                onClick={() => setActiveSubTab('tags')}
                                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeSubTab === 'tags' ? 'bg-rose-50 text-rose-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Từ khóa (Tags)
                            </button>
                        </div>

                        {/* Categories */}
                        {activeSubTab === 'categories' && (
                            <BranchCategoriesSubTab 
                                categories={utilities?.categories} 
                                id_brand={id_brand}
                                id={id}
                            />
                        )}

                        {/* Amenities */}
                        {activeSubTab === 'amenities' && (
                            <BranchAmenitiesSubTab 
                                amenities={utilities?.amenities} 
                                id_brand={id_brand} 
                                id={id} 
                            />
                        )}

                        {/* Tags */}
                        {activeSubTab === 'tags' && <BranchTagsSubTab tags={utilities?.tags} id_brand={id_brand} id={id} />}
                    </div>
                )}
            </div>
        </FadeIn>
    );
};

export default BranchUtilitiesTab;
