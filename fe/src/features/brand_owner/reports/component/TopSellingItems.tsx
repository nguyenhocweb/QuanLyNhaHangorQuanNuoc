import React from 'react';
import { TopSellingItem } from '../type/report.type';
import { Div, H } from "@/src/core/components/ui";
import { BsTrophy } from 'react-icons/bs';

interface TopSellingItemsProps {
    data: TopSellingItem[];
}

const TopSellingItems: React.FC<TopSellingItemsProps> = ({ data }) => {
    return (
        <Div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full h-full" vitri="col_none">
            <H className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BsTrophy className="text-amber-500" /> Top 5 Món Bán Chạy
            </H>
            <div className="space-y-4">
                {data.map((item, index) => (
                    <div key={item.menuItemId} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                            ${index === 0 ? 'bg-amber-100 text-amber-600' : 
                              index === 1 ? 'bg-gray-200 text-gray-600' : 
                              index === 2 ? 'bg-orange-100 text-orange-600' : 
                              'bg-indigo-50 text-indigo-600'}`}>
                            #{index + 1}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-500">Đã bán: {item.totalQuantity} phần</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-indigo-600 text-sm">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalRevenue)}
                            </p>
                        </div>
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                        Chưa có dữ liệu bán hàng
                    </div>
                )}
            </div>
        </Div>
    );
};

export default TopSellingItems;
