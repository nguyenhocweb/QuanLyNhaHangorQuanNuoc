import React from 'react';
import { UnreviewedMealItem } from '../type/review.type';
import { FaStore, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers, FaStar, FaReceipt } from 'react-icons/fa';

interface Props {
    meal: UnreviewedMealItem;
    onWriteReview: (meal: UnreviewedMealItem) => void;
}

export const UnreviewedMealCard: React.FC<Props> = ({ meal, onWriteReview }) => {
    const restaurantName = meal.restaurant?.name || "Nhà hàng Foleat";
    const restaurantLogo = meal.restaurant?.logo || meal.restaurant?.imageMain;
    const addressStr = meal.restaurant?.address ? 
        [meal.restaurant.address.street, meal.restaurant.address.ward, meal.restaurant.address.district, meal.restaurant.address.province].filter(Boolean).join(", ") 
        : "Hệ thống nhà hàng Foleat";

    const formattedDate = meal.reservation_date ? 
        new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(meal.reservation_date))
        : "N/A";

    return (
        <div className="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-all duration-200 hover:shadow-md">
            {/* Left: Restaurant info & Reservation details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                    {restaurantLogo ? (
                        <img src={restaurantLogo} alt={restaurantName} className="w-full h-full object-cover" />
                    ) : (
                        <FaStore className="w-7 h-7 text-amber-500" />
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 text-lg">{restaurantName}</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 font-mono text-xs font-semibold">
                            <FaReceipt className="w-3 h-3 text-gray-400" />
                            #{meal.confirmation_code?.slice(-6).toUpperCase() || "MEAL"}
                        </span>
                    </div>

                    <span className="text-xs text-gray-500 flex items-center gap-1.5 line-clamp-1">
                        <FaMapMarkerAlt className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        {addressStr}
                    </span>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600 mt-1">
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                            <FaCalendarAlt className="text-indigo-500 w-3 h-3" />
                            Ngày ăn: {formattedDate}
                        </span>
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                            <FaClock className="text-indigo-500 w-3 h-3" />
                            Giờ đến: {meal.start_time || "N/A"}
                        </span>
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                            <FaUsers className="text-indigo-500 w-3 h-3" />
                            Số khách: {meal.party_size || 1} người
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Write review CTA button */}
            <div className="w-full sm:w-auto flex justify-end">
                <button
                    onClick={() => onWriteReview(meal)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group flex-shrink-0"
                >
                    <FaStar className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-200" />
                    Viết đánh giá ngay
                </button>
            </div>
        </div>
    );
};
