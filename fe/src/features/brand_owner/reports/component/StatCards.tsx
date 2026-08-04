import React from 'react';
import { ReportOverview } from '../type/report.type';
import { Div, H, P } from "@/src/core/components/ui";
import { BsCurrencyDollar, BsCart3, BsGraphUpArrow } from "react-icons/bs";

interface StatCardsProps {
    overview: ReportOverview;
}

const StatCards: React.FC<StatCardsProps> = ({ overview }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <Div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center justify-between" vitri="row_between">
                <div>
                    <P className="text-gray-500 font-medium mb-1">Tổng doanh thu</P>
                    <H className="text-2xl font-bold text-gray-800">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(overview.totalRevenue)}
                    </H>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <BsCurrencyDollar className="text-2xl" />
                </div>
            </Div>

            <Div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center justify-between" vitri="row_between">
                <div>
                    <P className="text-gray-500 font-medium mb-1">Tổng đơn hàng (Đã thanh toán)</P>
                    <H className="text-2xl font-bold text-gray-800">
                        {new Intl.NumberFormat('vi-VN').format(overview.totalOrders)}
                    </H>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <BsCart3 className="text-2xl" />
                </div>
            </Div>

            <Div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center justify-between" vitri="row_between">
                <div>
                    <P className="text-gray-500 font-medium mb-1">Giá trị đơn trung bình</P>
                    <H className="text-2xl font-bold text-gray-800">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(overview.averageOrderValue)}
                    </H>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <BsGraphUpArrow className="text-2xl" />
                </div>
            </Div>
        </div>
    );
};

export default StatCards;
