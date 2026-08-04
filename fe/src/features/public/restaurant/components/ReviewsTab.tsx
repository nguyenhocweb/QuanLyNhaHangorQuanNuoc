import React, { Fragment, useState } from "react";
import Image from "next/image";
import { useGetPublicRestaurantReviews } from "../hook/useGetPublicRestaurantReviews";
import { IPublicRestaurantCore } from "../type/restaurant.public.type";
import { FaStar } from "react-icons/fa";
import { cn } from "@/src/core/lib/tw";
import { toast } from "sonner";

interface Props {
    restaurantId: string;
    coreInfo: IPublicRestaurantCore;
}

const ReviewsTab: React.FC<Props> = ({ restaurantId, coreInfo }) => {
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<string>("latest");
    const [hasImage, setHasImage] = useState<boolean>(false);
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetPublicRestaurantReviews(restaurantId, 10, ratingFilter, sortBy, hasImage);


    return (
        <div className="flex flex-col gap-8">
            {/* Top: Summary */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-8">
                <div className="flex flex-col items-center justify-center flex-shrink-0">
                    <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full border-[6px] border-amber-400 bg-amber-50 shadow-inner mb-3">
                        <span className="text-4xl font-black text-amber-500 drop-shadow-sm">{coreInfo.averageRating?.toFixed(1)}</span>
                    </div>
                    <div className="flex text-amber-400 text-xl mb-1 drop-shadow-sm">
                        {[1,2,3,4,5].map(s => (
                            <FaStar key={s} className={s <= Math.round(coreInfo.averageRating) ? "text-amber-400" : "text-gray-200"} />
                        ))}
                    </div>
                    <span className="text-gray-500 font-medium text-sm mt-1">{coreInfo.totalRating} lượt đánh giá</span>
                </div>
                
                <div className="flex-1 w-full flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Đánh giá từ khách hàng</h3>
                    <p className="text-gray-500 leading-relaxed text-sm mb-4">
                        Những đánh giá dưới đây được tổng hợp từ các khách hàng đã trực tiếp trải nghiệm tại nhà hàng. 
                        Chúng tôi luôn lắng nghe để cải thiện chất lượng dịch vụ mỗi ngày.
                    </p>
                    
                    <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-gray-100">
                        {/* Star Filter */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-gray-800 mr-2">Lọc theo sao:</span>
                            <button
                                onClick={() => setRatingFilter(null)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 border",
                                    ratingFilter === null
                                        ? "bg-indigo-100 text-indigo-600 border-indigo-200 shadow-sm"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                )}
                            >
                                Tất cả
                            </button>
                            {[5, 4, 3, 2, 1].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setRatingFilter(star)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-200 border",
                                        ratingFilter === star
                                            ? "bg-indigo-100 text-indigo-600 border-indigo-200 shadow-sm"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    )}
                                >
                                    <span>{star}</span>
                                    <FaStar className={ratingFilter === star ? "text-amber-500" : "text-gray-300"} size={14} />
                                </button>
                            ))}
                        </div>

                        {/* Sort & Image Filter */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-gray-800 mr-2">Sắp xếp:</span>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer outline-none"
                            >
                                <option value="latest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                                <option value="highest_rated">Đánh giá cao nhất</option>
                                <option value="lowest_rated">Đánh giá thấp nhất</option>
                            </select>

                            <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>

                            <button
                                onClick={() => setHasImage(!hasImage)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 border",
                                    hasImage
                                        ? "bg-indigo-100 text-indigo-600 border-indigo-200 shadow-sm"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                )}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Có hình ảnh</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Review List */}
            <div className="flex-1 space-y-6">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">Đang tải đánh giá...</div>
                ) : !data || data.pages[0].reviews.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <h4 className="text-lg font-bold text-gray-800">Không tìm thấy đánh giá</h4>
                        <p className="text-gray-500 mt-2">Chưa có đánh giá nào phù hợp với bộ lọc hiện tại.</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {data.pages.map((page, i) => (
                                <Fragment key={i}>
                                    {page.reviews.map(review => (
                                        <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                        <Image 
                                                            src={review.user?.avatar || "/img/avatar_mac_dinh.jpg"} 
                                                            alt="Avatar" 
                                                            width={40} 
                                                            height={40} 
                                                            className="object-cover w-full h-full" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-gray-800 text-sm">{review.user?.name || "Người dùng ẩn danh"}</h5>
                                                        <p className="text-xs text-gray-400">
                                                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex text-amber-400 text-sm">
                                                    {[1,2,3,4,5].map(s => (
                                                        <FaStar key={s} className={s <= review.overall_rating ? "text-amber-400" : "text-gray-200"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                                {review.comment || "Đánh giá không có bình luận."}
                                            </p>
                                            
                                            {/* Images */}
                                            {review.images && review.images.length > 0 && (
                                                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                                                    {review.images.map((img, idx) => (
                                                        <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                                            <Image src={img} alt="Review image" fill className="object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}


                                            {/* Staff Response */}
                                            {review.staff_response && (
                                                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 ml-4 relative">
                                                    <div className="absolute w-3 h-3 bg-gray-50 border-t border-l border-gray-100 -top-[7px] left-6 transform rotate-45"></div>
                                                    <h6 className="font-bold text-indigo-800 text-xs mb-1">Phản hồi từ Nhà hàng:</h6>
                                                    <p className="text-sm text-gray-700 italic">{review.staff_response}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </Fragment>
                            ))}
                        </div>

                        {hasNextPage && (
                            <div className="flex justify-center pt-6">
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="px-6 py-2.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {isFetchingNextPage ? "Đang tải..." : "Xem thêm đánh giá"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ReviewsTab;
