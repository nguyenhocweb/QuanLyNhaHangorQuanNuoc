import React, { useState } from 'react';
import { useGetMyReviews } from '../hook/useGetMyReviews';
import { useGetUnreviewedMeals } from '../hook/useGetUnreviewedMeals';
import { useDeleteReview } from '../hook/useDeleteReview';
import { ReviewStatsHeader } from './ReviewStatsHeader';
import { MyReviewCard } from './MyReviewCard';
import { UnreviewedMealCard } from './UnreviewedMealCard';
import { ReviewFormModal } from './ReviewFormModal';
import { ConfirmModal } from '@/src/core/components/layout/public-ConfirmModal';
import { Review, UnreviewedMealItem } from '../type/review.type';
import { FaCommentDots, FaClock, FaFilter, FaStar, FaChevronLeft, FaChevronRight, FaExclamationCircle } from 'react-icons/fa';

export const MyReviewsContainer: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'history' | 'pending'>('history');

    // Filter states for History Tab
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [ratingFilter, setRatingFilter] = useState<string>('0');
    const [historyPage, setHistoryPage] = useState<number>(1);
    const [historyLimit, setHistoryLimit] = useState<number>(10);

    // Pagination for Pending Tab
    const [pendingPage, setPendingPage] = useState<number>(1);
    const [pendingLimit, setPendingLimit] = useState<number>(10);

    // Modal states
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [reviewingMeal, setReviewingMeal] = useState<UnreviewedMealItem | null>(null);
    const [deletingReview, setDeletingReview] = useState<Review | null>(null);

    const { data: historyData, isLoading: isHistoryLoading } = useGetMyReviews({
        page: historyPage,
        limit: historyLimit,
        status: statusFilter,
        rating: ratingFilter !== '0' ? ratingFilter : undefined
    });

    const { data: pendingData, isLoading: isPendingLoading } = useGetUnreviewedMeals({
        page: pendingPage,
        limit: pendingLimit
    });

    const deleteMutation = useDeleteReview();

    const reviewsList = historyData?.metadata?.reviews || [];
    const stats = historyData?.metadata?.stats;
    const historyPagination = historyData?.metadata?.pagination;

    const mealsList = pendingData?.metadata?.meals || [];
    const pendingPagination = pendingData?.metadata?.pagination;

    const handleDeleteConfirm = async () => {
        if (!deletingReview) return;
        await deleteMutation.mutateAsync(deletingReview.id);
        setDeletingReview(null);
    };

    const renderPagination = (
        currentPage: number, 
        limit: number, 
        total: number, 
        totalPages: number, 
        onPageChange: (p: number) => void,
        onLimitChange: (l: number) => void
    ) => {
        const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
        const endItem = Math.min(currentPage * limit, total);

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full pt-4 border-t border-gray-100 bg-white p-4 rounded-2xl shadow-sm mt-4">
                <span className="text-xs text-gray-500 font-medium">
                    Hiển thị <strong className="text-gray-800">{startItem}</strong> đến <strong className="text-gray-800">{endItem}</strong> của <strong className="text-gray-800">{total}</strong> kết quả
                </span>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span>Số dòng:</span>
                        <select
                            value={limit}
                            onChange={(e) => {
                                onLimitChange(Number(e.target.value));
                                onPageChange(1);
                            }}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200"
                        >
                            <FaChevronLeft className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-100">
                            {currentPage} / {totalPages || 1}
                        </span>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= (totalPages || 1)}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200"
                        >
                            <FaChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Header Stats */}
            <ReviewStatsHeader stats={stats} isLoading={isHistoryLoading && !stats} />

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl w-fit border border-gray-200/50 self-start">
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                        activeTab === 'history'
                            ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                >
                    <FaCommentDots className="w-4 h-4" />
                    <span>Đánh giá của tôi</span>
                    {stats?.totalReviews !== undefined && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-mono">
                            {stats.totalReviews}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                        activeTab === 'pending'
                            ? 'bg-white text-amber-600 shadow-sm ring-1 ring-gray-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                >
                    <FaClock className="w-4 h-4" />
                    <span>Bữa ăn chờ đánh giá</span>
                    {stats?.unreviewedCount !== undefined && stats.unreviewedCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                            {stats.unreviewedCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Tab Content 1: History */}
            {activeTab === 'history' && (
                <div className="w-full flex flex-col gap-4 animate-in fade-in duration-200">
                    {/* Filters Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                            <FaFilter className="text-indigo-500 w-3.5 h-3.5" />
                            <span>Bộ lọc đánh giá:</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setHistoryPage(1);
                                }}
                                className="px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="APPROVED">Đã hiển thị</option>
                                <option value="PENDING">Chờ kiểm duyệt</option>
                                <option value="REJECTED_SPAM">Vi phạm / Từ chối</option>
                            </select>

                            <select
                                value={ratingFilter}
                                onChange={(e) => {
                                    setRatingFilter(e.target.value);
                                    setHistoryPage(1);
                                }}
                                className="px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            >
                                <option value="0">Tất cả số sao</option>
                                <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
                                <option value="4">⭐⭐⭐⭐ (4 sao)</option>
                                <option value="3">⭐⭐⭐ (3 sao)</option>
                                <option value="2">⭐⭐ (2 sao)</option>
                                <option value="1">⭐ (1 sao)</option>
                            </select>
                        </div>
                    </div>

                    {/* List */}
                    {isHistoryLoading ? (
                        <div className="flex flex-col gap-4 w-full">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="w-full h-44 bg-white rounded-2xl border border-gray-100 p-6 animate-pulse flex flex-col gap-3">
                                    <div className="w-1/3 h-6 bg-gray-200 rounded-lg"></div>
                                    <div className="w-full h-12 bg-gray-100 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    ) : reviewsList.length > 0 ? (
                        <div className="flex flex-col gap-4 w-full">
                            {reviewsList.map((rev) => (
                                <MyReviewCard
                                    key={rev.id}
                                    review={rev}
                                    onEdit={(r) => setEditingReview(r)}
                                    onDelete={(r) => setDeletingReview(r)}
                                />
                            ))}
                            {renderPagination(
                                historyPagination?.page || 1,
                                historyPagination?.limit || 10,
                                historyPagination?.total || 0,
                                historyPagination?.totalPages || 1,
                                setHistoryPage,
                                setHistoryLimit
                            )}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center flex flex-col items-center justify-center gap-3 w-full shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <FaCommentDots className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-gray-800 text-base">Chưa tìm thấy bài đánh giá nào</span>
                            <p className="text-xs text-gray-500 max-w-sm">
                                Bạn chưa viết đánh giá nào hoặc không có bài đánh giá khớp với bộ lọc hiện tại.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Tab Content 2: Pending Meals */}
            {activeTab === 'pending' && (
                <div className="w-full flex flex-col gap-4 animate-in fade-in duration-200">
                    {isPendingLoading ? (
                        <div className="flex flex-col gap-4 w-full">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="w-full h-28 bg-white rounded-2xl border border-gray-100 p-6 animate-pulse flex items-center justify-between">
                                    <div className="w-1/3 h-6 bg-gray-200 rounded-lg"></div>
                                    <div className="w-24 h-10 bg-gray-200 rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                    ) : mealsList.length > 0 ? (
                        <div className="flex flex-col gap-4 w-full">
                            {mealsList.map((meal) => (
                                <UnreviewedMealCard
                                    key={meal.id}
                                    meal={meal}
                                    onWriteReview={(m) => setReviewingMeal(m)}
                                />
                            ))}
                            {renderPagination(
                                pendingPagination?.page || 1,
                                pendingPagination?.limit || 10,
                                pendingPagination?.total || 0,
                                pendingPagination?.totalPages || 1,
                                setPendingPage,
                                setPendingLimit
                            )}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center flex flex-col items-center justify-center gap-3 w-full shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <FaStar className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-gray-800 text-base">Tuyệt vời! Bạn đã hoàn thành tất cả đánh giá</span>
                            <p className="text-xs text-gray-500 max-w-sm">
                                Không có bữa ăn nào đã hoàn thành đang chờ nhận xét. Cảm ơn bạn đã luôn đồng hành cùng Foleat!
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            <ReviewFormModal
                open={!!editingReview || !!reviewingMeal}
                onClose={() => {
                    setEditingReview(null);
                    setReviewingMeal(null);
                }}
                initialData={editingReview}
                reservation={reviewingMeal}
            />

            <ConfirmModal
                open={!!deletingReview}
                title="Xác nhận xóa đánh giá"
                content="Bạn có chắc chắn muốn xóa bài đánh giá này không? Sau khi xóa, điểm số trung bình của nhà hàng sẽ được cập nhật lại và hành động này không thể khôi phục."
                type="danger"
                isLoading={deleteMutation.isPending}
                confirmText="Xóa đánh giá"
                cancelText="Hủy"
                onClose={() => setDeletingReview(null)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};
