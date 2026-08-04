import React from 'react';
import { Review } from '../type/review.type';
import { FaStar, FaThumbsUp, FaEdit, FaTrashAlt, FaStore, FaMapMarkerAlt, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';

interface Props {
    review: Review;
    onEdit: (review: Review) => void;
    onDelete: (review: Review) => void;
}

export const MyReviewCard: React.FC<Props> = ({ review, onEdit, onDelete }) => {
    const renderStatusBadge = (status: Review['status']) => {
        switch (status) {
            case 'APPROVED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm">
                        <FaCheckCircle className="w-3 h-3 text-emerald-500" />
                        Đã hiển thị
                    </span>
                );
            case 'PENDING':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm">
                        <FaClock className="w-3 h-3 text-amber-500" />
                        Chờ kiểm duyệt
                    </span>
                );
            case 'REJECTED_SPAM':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-sm">
                        <FaExclamationCircle className="w-3 h-3 text-rose-500" />
                        Từ chối / Vi phạm
                    </span>
                );
        }
    };

    const restaurantName = review.restaurant?.name || "Nhà hàng đối tác";
    const restaurantLogo = review.restaurant?.logo || review.restaurant?.imageMain;
    const addressStr = review.restaurant?.address ? 
        [review.restaurant.address.street, review.restaurant.address.ward, review.restaurant.address.district, review.restaurant.address.province].filter(Boolean).join(", ") 
        : "Địa chỉ hệ thống Foleat";

    return (
        <div className="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 transition-all duration-200 hover:shadow-md">
            {/* Header: Restaurant Info & Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100 w-full">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                        {restaurantLogo ? (
                            <img src={restaurantLogo} alt={restaurantName} className="w-full h-full object-cover" />
                        ) : (
                            <FaStore className="w-6 h-6 text-indigo-500" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-base flex items-center gap-2">
                            {restaurantName}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5 line-clamp-1">
                            <FaMapMarkerAlt className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            {addressStr}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                    {renderStatusBadge(review.status)}
                    <span className="text-xs font-medium text-gray-400">
                        {new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(review.createdAt))}
                    </span>
                </div>
            </div>

            {/* Rating Stars & Breakdown */}
            <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-2 bg-yellow-50/80 px-3.5 py-1.5 rounded-xl border border-yellow-200/60 shadow-sm">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`w-4 h-4 ${star <= review.overall_rating ? 'text-yellow-400' : 'text-gray-200'}`}
                            />
                        ))}
                    </div>
                    <span className="font-bold text-yellow-700 ml-1 text-sm">{review.overall_rating}.0</span>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-gray-600 bg-gray-50 px-3.5 py-1.5 rounded-xl border border-gray-100">
                    {review.food_rating && (
                        <span><strong className="text-gray-700">Đồ ăn:</strong> {review.food_rating} sao</span>
                    )}
                    {review.service_rating && (
                        <span><strong className="text-gray-700">Phục vụ:</strong> {review.service_rating} sao</span>
                    )}
                    {review.ambiance_rating && (
                        <span><strong className="text-gray-700">Không gian:</strong> {review.ambiance_rating} sao</span>
                    )}
                </div>
            </div>

            {/* Comment */}
            {review.comment ? (
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm w-full bg-gray-50/50 p-4 rounded-xl border border-gray-100/80">
                    {review.comment}
                </p>
            ) : (
                <p className="text-gray-400 italic text-sm">(Khách hàng để lại đánh giá sao không kèm lời nhận xét)</p>
            )}

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <div className="flex gap-2.5 overflow-x-auto pb-2 w-full no-scrollbar">
                    {review.images.map((img, idx) => (
                        <div key={idx} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm group">
                            <img src={img} alt={`review-${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        </div>
                    ))}
                </div>
            )}

            {/* Staff Response */}
            {review.staff_response && (
                <div className="w-full bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex flex-col gap-1.5 mt-1">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-indigo-900 text-xs flex items-center gap-1.5">
                            <FaStore className="text-indigo-600" />
                            Phản hồi chính thức từ Nhà hàng
                        </span>
                    </div>
                    <p className="text-indigo-950/80 text-sm italic leading-relaxed">{review.staff_response}</p>
                </div>
            )}

            {/* Footer Actions & Helpful count */}
            <div className="flex flex-wrap justify-between items-center w-full pt-3 border-t border-gray-100 mt-1 gap-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <FaThumbsUp className="text-indigo-500 w-3.5 h-3.5" />
                    <span>Hữu ích: <strong className="text-gray-800 font-semibold">{review.helpful_count || 0}</strong> lượt</span>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => onEdit(review)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 flex items-center gap-1.5"
                    >
                        <FaEdit className="w-3.5 h-3.5" />
                        Chỉnh sửa
                    </button>
                    <button
                        onClick={() => onDelete(review)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 flex items-center gap-1.5"
                    >
                        <FaTrashAlt className="w-3.5 h-3.5" />
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};
