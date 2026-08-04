import React from 'react';
import { ReviewStats } from '../type/review.type';
import { FaStar, FaThumbsUp, FaCommentDots, FaClock } from 'react-icons/fa';

interface Props {
    stats?: ReviewStats;
    isLoading?: boolean;
}

export const ReviewStatsHeader: React.FC<Props> = ({ stats, isLoading }) => {
    const cards = [
        {
            title: "Tổng số đánh giá",
            value: stats?.totalReviews ?? 0,
            icon: <FaCommentDots className="w-5 h-5 text-indigo-600" />,
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-100",
            desc: "Đã đăng thành công"
        },
        {
            title: "Điểm trung bình",
            value: stats?.averageRating ? `${stats.averageRating.toFixed(1)} / 5.0` : "0.0 / 5.0",
            icon: <FaStar className="w-5 h-5 text-yellow-500" />,
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-100",
            desc: "Cảm nhận ẩm thực"
        },
        {
            title: "Lượt hữu ích",
            value: stats?.helpfulCount ?? 0,
            icon: <FaThumbsUp className="w-5 h-5 text-emerald-600" />,
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-100",
            desc: "Được cộng đồng thích"
        },
        {
            title: "Chờ đánh giá",
            value: stats?.unreviewedCount ?? 0,
            icon: <FaClock className="w-5 h-5 text-amber-600" />,
            bgColor: "bg-amber-50",
            borderColor: "border-amber-100",
            desc: "Bữa ăn chưa phản hồi"
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className={`p-5 rounded-2xl border ${card.borderColor} ${card.bgColor}/40 bg-white shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
                >
                    <div className="flex justify-between items-center w-full mb-3">
                        <span className="text-sm font-medium text-gray-600">{card.title}</span>
                        <div className={`p-2.5 rounded-xl ${card.bgColor} flex items-center justify-center shadow-sm`}>
                            {card.icon}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">
                            {isLoading ? (
                                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-lg my-1"></div>
                            ) : (
                                card.value
                            )}
                        </span>
                        <span className="text-xs text-gray-500 mt-1 font-medium">{card.desc}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
