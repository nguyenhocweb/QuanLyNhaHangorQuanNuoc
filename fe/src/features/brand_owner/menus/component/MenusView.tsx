import React, { useState } from "react";
import { Div, H } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import MenuCategoryTab from "./tabs/MenuCategoryTab";
import MenuItemsTab from "./tabs/MenuItemsTab";
import MenuTab from "./tabs/MenuTab";
import { MdFilterList } from "react-icons/md";
import { FaUtensils, FaBookOpen } from "react-icons/fa";

type TabType = "MENUS" | "CATEGORIES" | "ITEMS";

const MenusView = () => {
    const [activeTab, setActiveTab] = useState<TabType>("ITEMS");

    return (
        <FadeIn className="w-full">
            <Div vitri="col_none" className="gap-6 w-full">
                <Div className="w-full flex justify-between items-center bg-white p-4 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100/80">
                    <H level={2} className="text-2xl font-bold text-gray-800">
                        Quản lý Thực đơn
                    </H>
                    
                    {/* Tab Navigation */}
                    <Div className="flex p-1 space-x-1 bg-gray-100/80 rounded-xl border border-gray-200/50">
                        <button
                            onClick={() => setActiveTab("MENUS")}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                activeTab === "MENUS"
                                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            }`}
                        >
                            <FaBookOpen className="w-4 h-4 mr-2" />
                            Thực Đơn
                        </button>
                        <button
                            onClick={() => setActiveTab("CATEGORIES")}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                activeTab === "CATEGORIES"
                                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            }`}
                        >
                            <MdFilterList className="w-4 h-4 mr-2" />
                            Danh Mục
                        </button>
                        <button
                            onClick={() => setActiveTab("ITEMS")}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                activeTab === "ITEMS"
                                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            }`}
                        >
                            <FaUtensils className="w-4 h-4 mr-2" />
                            Món Ăn
                        </button>
                    </Div>
                </Div>

                {/* Tab Content */}
                <Div vitri="col_none" className="w-full transition-all duration-300">
                    {activeTab === "MENUS" && <MenuTab />}
                    {activeTab === "CATEGORIES" && <MenuCategoryTab />}
                    {activeTab === "ITEMS" && <MenuItemsTab />}
                </Div>
            </Div>
        </FadeIn>
    );
};

export default MenusView;
