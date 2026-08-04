import React, { useState } from 'react';
import { useGetBrandReviews } from '../hook/useGetBrandReviews';
import { FaReply, FaStar, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Review } from '../../../customer/reviews/type/review.type';
import FadeIn from '@/src/core/components/animation/FadeIn';

interface Props {
    brandId: string;
}

const ReviewsTable: React.FC<Props> = ({ brandId }) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [status, setStatus] = useState<string>('');
    const [rating, setRating] = useState<string>('');

    const { data, isLoading } = useGetBrandReviews(brandId, {
        page,
        limit,
        ...(status && { status }),
        ...(rating && { rating })
    });

    const reviews = data?.metadata?.reviews || [];
    const pagination = data?.metadata?.pagination;

    return (
        <FadeIn className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
                <h2 className="text-xl font-bold text-slate-800">Quản lý Đánh giá từ Khách hàng</h2>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                        <FaFilter className="text-gray-400 w-3 h-3" />
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                            className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="APPROVED">Đã duyệt (Công khai)</option>
                            <option value="PENDING">Chờ duyệt (Bị Report)</option>
                            <option value="REJECTED_SPAM">Spam / Ẩn</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                        <FaStar className="text-yellow-400 w-3 h-3" />
                        <select
                            value={rating}
                            onChange={(e) => { setRating(e.target.value); setPage(1); }}
                            className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
                        >
                            <option value="">Tất cả số sao</option>
                            <option value="5">5 Sao</option>
                            <option value="4">4 Sao</option>
                            <option value="3">3 Sao</option>
                            <option value="2">2 Sao</option>
                            <option value="1">1 Sao</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase">
                            <th className="py-3 font-semibold">Khách hàng</th>
                            <th className="py-3 font-semibold">Nhà hàng</th>
                            <th className="py-3 font-semibold">Đánh giá</th>
                            <th className="py-3 font-semibold">Nội dung</th>
                            <th className="py-3 font-semibold">Trạng thái</th>
                            <th className="py-3 font-semibold text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-400">Không có đánh giá nào</td></tr>
                        ) : reviews.map((review: any) => (
                            <tr key={review.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 font-medium text-slate-800">{review.user?.fullName}</td>
                                <td className="py-4 text-gray-600">{review.restaurant?.name}</td>
                                <td className="py-4">
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <FaStar />
                                        <span className="font-bold">{review.overall_rating}</span>
                                    </div>
                                </td>
                                <td className="py-4 text-gray-600 max-w-xs truncate">{review.comment || <i>Không có bình luận</i>}</td>
                                <td className="py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${review.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        review.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {review.status}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <button className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 inline-flex">
                                        <FaReply /> Phản hồi
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isLoading && (
                    <div className="w-full flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {pagination && (
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 mt-2">
                    <span className="text-sm text-gray-500">
                        Hiển thị {((pagination.page - 1) * pagination.limit) + 1} đến {Math.min(pagination.page * pagination.limit, pagination.total)} của {pagination.total} kết quả
                    </span>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Hiển thị:</span>
                            <select
                                value={limit}
                                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                                className="border border-gray-200 rounded-lg px-2 py-1 outline-none cursor-pointer"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={pagination.page <= 1}
                                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <FaChevronLeft className="w-3 h-3" />
                            </button>
                            <span className="px-4 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-sm">
                                {pagination.page} / {pagination.totalPages || 1}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={pagination.page >= pagination.totalPages}
                                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <FaChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FadeIn>
    );
};

export default ReviewsTable;
