"use client";
import React from 'react';
import { Div, H, P } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { FiStar } from 'react-icons/fi';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useGetBrandReviews } from '../../reviews/hook/useGetBrandReviews';

const RecentReviewsComponent = () => {
    const { activeWorkspace } = useAuthStore();
    const brandId = activeWorkspace?.id;
    
    // Fetch 5 latest reviews
    const { data, isLoading } = useGetBrandReviews(brandId, { page: 1, limit: 5 });
    const reviews = data?.metadata?.reviews || [];

    return (
        <FadeIn delay={0.4} className="w-full h-full">
            <Div vitri="col_none" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full h-full">
                <H className="text-lg font-bold text-gray-900 mb-6">Đánh giá mới nhất</H>
                
                <div className="flex flex-col gap-4">
                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review: any) => (
                            <div key={review.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-indigo-50/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">{review.user?.name || 'Khách hàng ẩn danh'}</div>
                                        <div className="text-xs text-gray-500">{review.restaurant?.name || 'Chi nhánh'}</div>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                                
                                <div className="flex text-amber-400 mb-2 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar key={i} className={i < review.overall_rating ? "fill-amber-400" : "text-gray-300"} />
                                    ))}
                                </div>
                                
                                <P className="text-sm text-gray-700 italic">"{review.comment}"</P>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 text-sm py-8">Chưa có đánh giá nào gần đây.</div>
                    )}
                </div>
            </Div>
        </FadeIn>
    );
};

export default RecentReviewsComponent;
