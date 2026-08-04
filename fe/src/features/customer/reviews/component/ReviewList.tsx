import React, { useState } from 'react';
import { useGetRestaurantReviews } from '../hook/useGetRestaurantReviews';
import ReviewCard from './ReviewCard';
import { FaSortAmountDown } from 'react-icons/fa';
import FadeIn from '@/src/core/components/animation/FadeIn';

interface Props {
    restaurantId: string;
}

const ReviewList: React.FC<Props> = ({ restaurantId }) => {
    const [sortBy, setSortBy] = useState<'newest' | 'helpful'>('newest');
    
    const { data, isLoading } = useGetRestaurantReviews(restaurantId, { sortBy, limit: 10 });

    if (isLoading) {
        return <div className="w-full py-10 flex justify-center text-gray-500">Đang tải đánh giá...</div>;
    }

    const reviews = data?.metadata?.reviews || [];

    return (
        <FadeIn className="w-full flex flex-col gap-6">
            <div className="w-full flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Khách hàng Đánh giá ({data?.metadata?.pagination?.total || 0})</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaSortAmountDown className="w-4 h-4 text-gray-400" />
                    <span>Sắp xếp theo:</span>
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-transparent border-none font-semibold text-indigo-600 focus:ring-0 cursor-pointer"
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="helpful">Hữu ích nhất</option>
                    </select>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="w-full bg-gray-50 rounded-2xl p-10 flex flex-col items-center justify-center border border-gray-100 border-dashed">
                    <span className="text-gray-400 font-medium">Chưa có đánh giá nào cho nhà hàng này.</span>
                </div>
            ) : (
                <div className="w-full flex flex-col gap-4">
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            )}
        </FadeIn>
    );
};

export default ReviewList;
