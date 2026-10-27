import React, { ReactNode, useEffect, useState } from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import FadeIn from "../animation/FadeIn";

interface StatCardProps {
    index: number;
    title: string;
    value: string | number;
    icon: ReactNode;
    iconWrapperClass?: string;
    trendValue?: string;
    trendLabel?: string;
    trendType?: 'up' | 'down' | 'neutral';
}

const colorBorders = [
    "bg-blue-500",
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-sky-500",
    "bg-teal-500"
];

const Public_Stat_Card = ({ index, title, value, icon, iconWrapperClass, trendLabel, trendValue, trendType }: StatCardProps) => {
    const [safeColor, setSafeColor] = useState("bg-blue-500");
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * colorBorders.length);
        setSafeColor(colorBorders[randomIndex]);
    }, []);

    const isPositive = trendType === 'up';
    const isNegative = trendType === 'down';

    return (
        <FadeIn delay={index / 10} className="w-full h-full">
            <div className="w-full h-full bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 relative overflow-hidden group">
                {/* Dải màu nhận diện thương hiệu tinh tế ở viền trái */}
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${safeColor}`} />

                <div className="flex items-center justify-between gap-2 pl-1">
                    <span className="text-xs sm:text-sm font-medium text-slate-500 truncate" title={title}>
                        {title}
                    </span>
                    <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 text-base sm:text-xl shadow-2xs ${iconWrapperClass}`}>
                        {icon}
                    </div>
                </div>

                <div className="pl-1">
                    <div className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate" title={String(value)}>
                        {value}
                    </div>
                    {(trendValue || trendLabel) && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-xs">
                            <span
                                className={`font-semibold flex items-center gap-0.5 ${
                                    isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-slate-400'
                                }`}
                            >
                                {isPositive && <FiTrendingUp className="w-3 h-3" />}
                                {isNegative && <FiTrendingDown className="w-3 h-3" />}
                                {trendValue}
                            </span>
                            <span className="text-slate-400 truncate">{trendLabel}</span>
                        </div>
                    )}
                </div>
            </div>
        </FadeIn>
    );
};

export default Public_Stat_Card;