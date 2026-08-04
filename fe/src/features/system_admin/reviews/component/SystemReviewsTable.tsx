"use client";
import React, { useState } from 'react';
import { useGetSystemReviews } from '../hook/useGetSystemReviews';
import { useUpdateReviewStatus } from '../hook/useUpdateReviewStatus';
import { FaStar, FaFilter, FaChevronLeft, FaChevronRight, FaCheck, FaBan } from 'react-icons/fa';
import FadeIn from '@/src/core/components/animation/FadeIn';

const SystemReviewsTable = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [status, setStatus] = useState<string>('');
    const [rating, setRating] = useState<string>('');

    const { data, isLoading } = useGetSystemReviews({ 
        page, 
        limit, 
        ...(status && { status }),
        ...(rating && { rating })
    });

    const { mutate: updateStatus, isPending: isUpdating } = useUpdateReviewStatus();

    const reviews = data?.metadata?.reviews || [];
    const pagination = data?.metadata?.pagination;

    return (
        <FadeIn className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
                <h2 className="text-xl font-bold text-slate-800">Quản lý Toàn b�" Đánh giá</h2>
                
                {/* Filters */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                        <FaFilter className="text-gray-400 w-3 h-3" />
                        <select 
                            value={status} 
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                            className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 cursor-pointer"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="APPROVED">Đã duy�!t (Công khai)</option>
                            <option value="PENDING">Chờ duy�!t</option>
                            <option value="REJECTED_SPAM">Spam / B�9 chặn</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                        <FaStar className="text-yellow-400 w-3 h-3" />
                        <select 
                            value={rating} 
                            onChange={(e) => { setRating(e.target.value); setPage(1); }}
                            className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 cursor-pointer"
                        >
                            <option value="">Tất cả s� sao</option>
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
                        <tr className="border-b border-gray-200 text-sm font-semibold text-slate-500">
                            <th className="py-3 px-2">Khách hàng</th>
                            <th className="py-3 px-2">Nhà hàng (Chi nhánh)</th>
                            <th className="py-3 px-2">Đánh giá</th>
                            <th className="py-3 px-2">Bình luận</th>
                            <th className="py-3 px-2">Trạng thái</th>
                            <th className="py-3 px-2">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {isLoading ? (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-500">Đang tải dữ li�!u...</td></tr>
                        ) : reviews.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-400">Không có �ánh giá nào</td></tr>
                        ) : reviews.map((review: any) => (
                            <tr key={review.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-2 font-medium text-slate-800">{review.user?.name || 'Khách hàng'}</td>
                                <td className="py-4 px-2 text-gray-600">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-700">{review.restaurant?.name}</span>
                                        <span className="text-xs text-indigo-500">{review.restaurant?.brand?.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-2">
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <span className="font-bold">{review.overall_rating}</span>
                                        <FaStar className="w-3 h-3" />
                                    </div>
                                </td>
                                <td className="py-4 px-2 max-w-xs truncate text-gray-600" title={review.comment || 'Không có bình luận'}>
                                    {review.comment || <span className="text-gray-400 italic">Không có bình luận</span>}
                                </td>
                                <td className="py-4 px-2">
                                    {review.status === 'APPROVED' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Đã duy�!t</span>}
                                    {review.status === 'PENDING' && <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">Chờ duy�!t</span>}
                                    {review.status === 'REJECTED_SPAM' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Spam</span>}
                                </td>
                                <td className="py-4 px-2">
                                    <div className="flex items-center gap-2">
                                        {review.status !== 'APPROVED' && (
                                            <button 
                                                onClick={() => updateStatus({ reviewId: review.id, data: { status: 'APPROVED' } })}
                                                disabled={isUpdating}
                                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors tooltip"
                                                title="Duy�!t (HiỒn th�9 công khai)"
                                            >
                                                <FaCheck />
                                            </button>
                                        )}
                                        {review.status !== 'REJECTED_SPAM' && (
                                            <button 
                                                onClick={() => updateStatus({ reviewId: review.id, data: { status: 'REJECTED_SPAM' } })}
                                                disabled={isUpdating}
                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors tooltip"
                                                title="Chặn (Đánh dấu Spam)"
                                            >
                                                <FaBan />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                        HiỒn th�9 {((pagination.page - 1) * pagination.limit) + 1} �ến {Math.min(pagination.page * pagination.limit, pagination.total)} của {pagination.total} kết quả
                    </span>
                    
                    <div className="flex items-center gap-2">
                        <select 
                            value={limit}
                            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white"
                        >
                            <option value={5}>5 / trang</option>
                            <option value={10}>10 / trang</option>
                            <option value={20}>20 / trang</option>
                            <option value={50}>50 / trang</option>
                        </select>
                        
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent text-gray-600 transition-colors"
                            >
                                <FaChevronLeft className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium text-slate-700 bg-gray-50 border-x border-gray-200">
                                {page} / {pagination.totalPages}
                            </span>
                            <button 
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent text-gray-600 transition-colors"
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

export default SystemReviewsTable;
