import React, { useState, useEffect } from 'react';
import { useGetSubscriptionPlans } from '../hook/useGetSubscriptionPlans';
import { useCreatePaymentMyBrandSubscription } from '../hook/useCreatePaymentMyBrandSubscription';
import { checkMyBrandPaymentStatusService } from '../service/my_brand_subscription.check_status.service';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { BiCheck, BiX, BiQrScan, BiLoaderAlt } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const SubscriptionPaymentFlow = ({ isOpen, onClose }: Props) => {
    const { data: plans, isLoading: isPlansLoading } = useGetSubscriptionPlans();
    const { mutate: createPayment, isPending: isCreatingPayment } = useCreatePaymentMyBrandSubscription();
    const queryClient = useQueryClient();

    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [isCheckingPayment, setIsCheckingPayment] = useState(false);

    // Poll payment status
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (paymentData?.transactionId) {
            setIsCheckingPayment(true);
            interval = setInterval(async () => {
                try {
                    const statusRes = await checkMyBrandPaymentStatusService(paymentData.transactionId);
                    if (statusRes?.data?.status === 'SUCCESS' || statusRes?.data?.status === 'COMPLETED') {
                        clearInterval(interval);
                        toast.success('Thanh toán thành công!');
                        setIsCheckingPayment(false);
                        queryClient.invalidateQueries({ queryKey: ['myBrandSubscription'] });
                        onClose();
                    } else if (statusRes?.data?.status === 'FAILED') {
                        clearInterval(interval);
                        toast.error('Thanh toán thất bại!');
                        setIsCheckingPayment(false);
                    }
                } catch (error) {
                    console.error('Error checking payment status:', error);
                }
            }, 3000); // poll every 3 seconds
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [paymentData?.transactionId, onClose, queryClient]);

    const handleSelectPlan = (planId: string) => {
        setSelectedPlanId(planId);
    };

    const handleCreatePayment = () => {
        if (!selectedPlanId) return;
        createPayment({ planId: selectedPlanId }, {
            onSuccess: (res) => {
                setPaymentData(res.data);
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <FadeIn className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-10"
                >
                    <BiX size={24} className="text-slate-600" />
                </button>

                <div className="p-8 overflow-y-auto">
                    {!paymentData ? (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-slate-800 mb-2">Chọn gói cước của bạn</h2>
                                <p className="text-slate-500">Nâng tầm quản lý thương hiệu với các tính năng cao cấp</p>
                            </div>

                            {isPlansLoading ? (
                                <div className="flex justify-center items-center py-20">
                                    <BiLoaderAlt className="animate-spin text-4xl text-blue-500" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {plans?.map((plan) => (
                                        <div 
                                            key={plan.id}
                                            onClick={() => handleSelectPlan(plan.id)}
                                            className={`rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                                                selectedPlanId === plan.id 
                                                    ? 'border-blue-500 bg-blue-50/50 shadow-md transform scale-[1.02]' 
                                                    : 'border-slate-200 hover:border-blue-300'
                                            }`}
                                        >
                                            {plan.isFeatured && (
                                                <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                                                    PHỔ BIẾN NHẤT
                                                </span>
                                            )}
                                            <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                                            <div className="mb-6">
                                                <span className="text-3xl font-extrabold text-blue-600">
                                                    {plan.price.toLocaleString('vi-VN')}đ
                                                </span>
                                                <span className="text-slate-500 font-medium">
                                                    /{plan.billingCycle === 'MONTHLY' ? 'Tháng' : plan.billingCycle === 'YEARLY' ? 'Năm' : 'Vĩnh viễn'}
                                                </span>
                                            </div>

                                            <ul className="space-y-3 mb-8">
                                                <li className="flex items-start gap-2">
                                                    <BiCheck className="text-green-500 mt-0.5" size={20} />
                                                    <span className="text-slate-600 text-sm">
                                                        Tối đa <strong>{plan.maxRestaurants === -1 ? 'Không giới hạn' : plan.maxRestaurants}</strong> nhà hàng
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <BiCheck className="text-green-500 mt-0.5" size={20} />
                                                    <span className="text-slate-600 text-sm">
                                                        Tối đa <strong>{plan.maxAccounts === -1 ? 'Không giới hạn' : plan.maxAccounts}</strong> tài khoản
                                                    </span>
                                                </li>
                                            </ul>

                                            <div className={`w-full py-2.5 rounded-xl text-center font-semibold transition-colors ${
                                                selectedPlanId === plan.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {selectedPlanId === plan.id ? 'Đang chọn' : 'Chọn gói này'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
                                <button
                                    disabled={!selectedPlanId || isCreatingPayment}
                                    onClick={handleCreatePayment}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    {isCreatingPayment ? <BiLoaderAlt className="animate-spin text-xl" /> : null}
                                    Tiến hành thanh toán
                                </button>
                            </div>
                        </>
                    ) : (
                        <FadeIn>
                            <div className="max-w-md mx-auto text-center">
                                <h2 className="text-2xl font-bold text-slate-800 mb-2 flex justify-center items-center gap-2">
                                    <BiQrScan className="text-blue-500" /> Quét mã QR để thanh toán
                                </h2>
                                <p className="text-slate-500 mb-8">Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã</p>
                                
                                <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-blue-200 inline-block mb-8 relative shadow-lg">
                                    <img 
                                        src={paymentData.qrCodeUrl} 
                                        alt="QR Code Thanh Toán" 
                                        className="w-64 h-64 object-contain"
                                    />
                                    {isCheckingPayment && (
                                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3">
                                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
                                            <p className="font-semibold text-blue-800 animate-pulse">Đang chờ thanh toán...</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-blue-50 p-6 rounded-2xl text-left border border-blue-100 mb-6">
                                    <div className="flex justify-between mb-3">
                                        <span className="text-slate-600 font-medium">Số tiền:</span>
                                        <span className="font-bold text-blue-700 text-xl">{paymentData.amount.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 font-medium">Nội dung chuyển khoản:</span>
                                        <span className="font-bold font-mono bg-white px-3 py-1 rounded border border-blue-200 text-slate-800">
                                            {paymentData.description}
                                        </span>
                                    </div>
                                    <p className="text-xs text-center text-slate-500 mt-4 italic">
                                        Vui lòng không thay đổi nội dung chuyển khoản để hệ thống tự động xác nhận.
                                    </p>
                                </div>
                                
                                <button 
                                    onClick={() => setPaymentData(null)}
                                    className="text-slate-500 hover:text-slate-800 font-medium underline"
                                >
                                    Quay lại chọn gói khác
                                </button>
                            </div>
                        </FadeIn>
                    )}
                </div>
            </FadeIn>
        </div>
    );
};
