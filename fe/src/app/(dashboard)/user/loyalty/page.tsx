"use client";

import { useGetLoyaltyHistory, useGetLoyaltyInfo } from "@/src/features/customer/loyalty/hook/useGetLoyalty";
import { LoyaltyCard } from "@/src/features/customer/loyalty/component/LoyaltyCard";
import { Div, H, P } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function LoyaltyPage() {
    const { data: infoData, isLoading: isInfoLoading } = useGetLoyaltyInfo();
    const { data: historyData, isLoading: isHistoryLoading } = useGetLoyaltyHistory();

    const brands = infoData?.metadata?.brands || [];
    const restaurants = infoData?.metadata?.restaurants || [];
    const history = historyData?.metadata || [];

    if (isInfoLoading) {
        return <div className="p-8 text-center text-gray-500">Đang tải thẻ thành viên...</div>;
    }

    return (
        <FadeIn className="w-full max-w-5xl mx-auto flex flex-col gap-8 p-6">
            <div className="flex flex-col gap-2">
                <H type="h2">Thẻ Thành Viên</H>
                <P type="p3" className="text-gray-500">Quản lý điểm thưởng và hạng thẻ của bạn tại các nhà hàng.</P>
            </div>

            {brands.length === 0 && restaurants.length === 0 ? (
                <Div variant="bg_white" className="p-12 text-center" vitri="col_center">
                    <img src="/assets/images/empty-card.png" alt="Empty" className="w-48 opacity-50 mb-4" />
                    <H type="h4" className="text-gray-600">Bạn chưa có thẻ thành viên nào</H>
                    <P type="p4" className="text-gray-400">Hãy đặt bàn và dùng bữa tại các nhà hàng để bắt đầu tích điểm nhé!</P>
                </Div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brands.map((brandInfo) => (
                        <LoyaltyCard key={brandInfo.id} data={brandInfo} type="BRAND" />
                    ))}
                    {restaurants.map((restInfo) => (
                        <LoyaltyCard key={restInfo.id} data={restInfo} type="RESTAURANT" />
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-4 mt-8">
                <H type="h3">Lịch sử giao dịch điểm</H>
                
                <Div variant="bg_white" className="overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 text-sm font-semibold text-gray-600">Thời gian</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Loại giao dịch</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Điểm</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Nội dung</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isHistoryLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-400">Đang tải lịch sử...</td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-400">Chưa có giao dịch nào</td>
                                </tr>
                            ) : (
                                history.map((tx) => (
                                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(tx.createdAt).toLocaleDateString('vi-VN')} {new Date(tx.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                tx.type === 'EARN' ? 'bg-green-100 text-green-700' :
                                                tx.type === 'SPEND' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {tx.type === 'EARN' ? 'TÍCH ĐIỂM' : tx.type === 'SPEND' ? 'TIÊU ĐIỂM' : 'HẾT HẠN'}
                                            </span>
                                        </td>
                                        <td className={`p-4 text-sm font-bold ${
                                            tx.type === 'EARN' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {tx.type === 'EARN' ? '+' : '-'}{tx.points.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">{tx.description || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Div>
            </div>
        </FadeIn>
    );
}
