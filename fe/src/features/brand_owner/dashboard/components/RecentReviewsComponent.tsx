import React from 'react';
import { Div, H, P } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { FiStar } from 'react-icons/fi';

const mockReviews = [
    { customer: 'Nguyễn Văn A', branch: 'Foleat Quận 1', rating: 5, comment: 'Đồ ăn rất ngon, phục vụ nhiệt tình!', time: '2 giờ trước' },
    { customer: 'Trần Thị B', branch: 'Foleat Quận 3', rating: 4, comment: 'Không gian đẹp, nhưng đợi món hơi lâu.', time: '5 giờ trước' },
    { customer: 'Lê Hoàng C', branch: 'Foleat Quận 1', rating: 5, comment: 'Sẽ quay lại ủng hộ nhà hàng dài dài.', time: '1 ngày trước' },
];

const RecentReviewsComponent = () => {
    return (
        <FadeIn delay={0.4} className="w-full">
            <Div vitri="col_none" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
                <H className="text-lg font-bold text-gray-900 mb-6">Đánh giá mới nhất</H>
                
                <div className="flex flex-col gap-4">
                    {mockReviews.map((review, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-indigo-50/30 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-semibold text-gray-900 text-sm">{review.customer}</div>
                                    <div className="text-xs text-gray-500">{review.branch}</div>
                                </div>
                                <div className="text-xs text-gray-400">{review.time}</div>
                            </div>
                            
                            <div className="flex text-amber-400 mb-2 text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} className={i < review.rating ? "fill-amber-400" : "text-gray-300"} />
                                ))}
                            </div>
                            
                            <P className="text-sm text-gray-700 italic">"{review.comment}"</P>
                        </div>
                    ))}
                </div>
            </Div>
        </FadeIn>
    );
};

export default RecentReviewsComponent;
