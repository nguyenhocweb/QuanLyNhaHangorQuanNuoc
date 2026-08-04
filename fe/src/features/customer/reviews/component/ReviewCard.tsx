import React from 'react';
import { Review } from '../type/review.type';
import { FaStar, FaThumbsUp, FaRegFlag } from 'react-icons/fa';

interface Props {
    review: Review;
}

const ReviewCard: React.FC<Props> = ({ review }) => {
    return (
        <div className="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 transition-all duration-200 hover:shadow-md">
            {/* Header: User Info & Rating */}
            <div className="flex justify-between items-start w-full">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                        {review.user?.avatar ? (
                            <img src={review.user.avatar} alt={review.user.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-indigo-600 font-bold text-lg">{review.user?.name?.charAt(0) || 'U'}</span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{review.user?.name || 'Khách hàng'}</span>
                        <span className="text-sm text-gray-500">
                            {new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(review.createdAt))}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                    <FaStar className="text-yellow-400 w-4 h-4" />
                    <span className="font-bold text-yellow-700">{review.overall_rating}.0</span>
                </div>
            </div>

            {/* Detailed Ratings */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 w-full">
                {review.food_rating && (
                    <div className="flex items-center gap-1"><span className="font-medium">Đồ ăn:</span> {review.food_rating}</div>
                )}
                {review.service_rating && (
                    <div className="flex items-center gap-1"><span className="font-medium">Phục vụ:</span> {review.service_rating}</div>
                )}
                {review.ambiance_rating && (
                    <div className="flex items-center gap-1"><span className="font-medium">Không gian:</span> {review.ambiance_rating}</div>
                )}
            </div>

            {/* Comment */}
            {review.comment && (
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed w-full">
                    {review.comment}
                </p>
            )}

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 w-full">
                    {review.images.map((img, idx) => (
                        <div key={idx} className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                            <img src={img} alt={`review-${idx}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                        </div>
                    ))}
                </div>
            )}

            {/* Staff Response */}
            {review.staff_response && (
                <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-2 mt-2">
                    <span className="font-semibold text-gray-800 flex items-center gap-2">
                        Phản hồi từ Nhà hàng
                    </span>
                    <p className="text-gray-600 text-sm italic">{review.staff_response}</p>
                </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-between items-center w-full pt-2 border-t border-gray-50 mt-2">
                <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors text-sm font-medium">
                    <FaThumbsUp />
                    <span>Hữu ích ({review.helpful_count || 0})</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm">
                    <FaRegFlag />
                    <span>Báo cáo</span>
                </button>
            </div>
        </div>
    );
};

export default ReviewCard;
