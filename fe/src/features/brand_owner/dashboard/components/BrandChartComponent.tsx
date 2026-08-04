import React from 'react';
import { Div, H, P } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';

const BrandChartComponent = () => {
    return (
        <FadeIn delay={0.2} className="w-full">
            <Div vitri="col_none" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full h-[400px]">
                <div className="flex justify-between items-center mb-6">
                    <H className="text-lg font-bold text-gray-900">Doanh thu 7 ngày qua</H>
                    <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
                        <option>7 ngày qua</option>
                        <option>30 ngày qua</option>
                        <option>Năm nay</option>
                    </select>
                </div>
                
                {/* Mock Chart UI */}
                <div className="flex-1 w-full flex items-end justify-between gap-2 pt-10 pb-4 relative">
                    {/* Y-axis labels mock */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pb-10">
                        <span>100M</span>
                        <span>75M</span>
                        <span>50M</span>
                        <span>25M</span>
                        <span>0</span>
                    </div>
                    
                    {/* Bars */}
                    <div className="w-full h-full flex items-end justify-between pl-12 gap-2">
                        {[40, 60, 45, 80, 50, 90, 70].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-indigo-100 rounded-t-lg relative group-hover:bg-indigo-200 transition-colors" style={{ height: `${height}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {height} Tr
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">T{i+2}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Div>
        </FadeIn>
    );
};

export default BrandChartComponent;
