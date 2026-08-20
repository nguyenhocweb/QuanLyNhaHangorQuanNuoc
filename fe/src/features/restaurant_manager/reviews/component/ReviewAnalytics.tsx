"use client";
import React from "react";
import { ReviewStats } from "../type/review.type";
import { FaStar } from "react-icons/fa";

export const ReviewAnalytics = ({ stats }: { stats: ReviewStats }) => {
    if (!stats || stats.total === 0) return null;
    
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col md:flex-row gap-8 w-full shadow-sm">
            <div className="flex flex-col items-center justify-center min-w-[200px] border-r border-gray-100 pr-8">
                <div className="text-5xl font-bold text-amber-500 mb-2">{stats.overall}</div>
                <div className="flex text-amber-500 text-lg mb-2">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.round(Number(stats.overall)) ? "" : "text-gray-200"} />
                    ))}
                </div>
                <div className="text-gray-500 text-sm">Dựa trên {stats.total} đánh giá</div>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
                <h3 className="font-semibold text-gray-700">Chi tiết trải nghiệm</h3>
                <div className="flex items-center gap-4">
                    <span className="w-24 text-sm text-gray-600">Đồ ăn</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(Number(stats.food) / 5) * 100}%` }}></div>
                    </div>
                    <span className="text-sm font-medium w-8">{stats.food}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="w-24 text-sm text-gray-600">Dịch vụ</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(Number(stats.service) / 5) * 100}%` }}></div>
                    </div>
                    <span className="text-sm font-medium w-8">{stats.service}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="w-24 text-sm text-gray-600">Không gian</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(Number(stats.ambiance) / 5) * 100}%` }}></div>
                    </div>
                    <span className="text-sm font-medium w-8">{stats.ambiance}</span>
                </div>
            </div>
        </div>
    );
};