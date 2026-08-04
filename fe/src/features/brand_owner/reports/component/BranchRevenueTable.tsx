import React from 'react';
import { BranchRevenue } from '../type/report.type';
import { Div, H } from "@/src/core/components/ui";

interface BranchRevenueTableProps {
    data: BranchRevenue[];
    totalRevenue: number;
}

const BranchRevenueTable: React.FC<BranchRevenueTableProps> = ({ data, totalRevenue }) => {
    return (
        <Div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full" vitri="col_none">
            <H className="text-lg font-bold text-gray-800 mb-6">Doanh thu theo chi nhánh</H>
            <div className="space-y-4">
                {data.map((branch) => {
                    const percentage = totalRevenue > 0 ? (branch.revenue / totalRevenue) * 100 : 0;
                    return (
                        <div key={branch.restaurantId} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-gray-700">{branch.restaurantName}</span>
                                <span className="text-gray-900">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(branch.revenue)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div 
                                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 text-right">{branch.orders} đơn hàng ({percentage.toFixed(1)}%)</p>
                        </div>
                    );
                })}
                {data.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                        Chưa có dữ liệu giao dịch
                    </div>
                )}
            </div>
        </Div>
    );
};

export default BranchRevenueTable;
