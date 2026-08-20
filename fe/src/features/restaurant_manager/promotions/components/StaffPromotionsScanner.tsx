import React, { useState } from 'react';
import { Div, H } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import useDebounce from '@/src/core/hooks/useDebounce';
import { useValidatePromotion } from '../hook/useValidatePromotion';
import { FaQrcode, FaCheckCircle, FaTimesCircle, FaSpinner, FaPhoneAlt } from 'react-icons/fa';

export const StaffPromotionsScanner = () => {
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  // Giả lập bill
  const [orderTotal] = useState<number>(250000); 
  const [itemsInCart] = useState<string[]>(['Nước Ép Cam', 'Lẩu Thái']); 
  
  const debouncedCode = useDebounce({ value: code, delay: 600 });
  const debouncedPhone = useDebounce({ value: phone, delay: 500 });
  
  const { mutate: validatePromo, isPending, data, error, reset } = useValidatePromotion();

  // Validate when debouncedCode changes or phone changes
  React.useEffect(() => {
    if (debouncedCode && debouncedCode.length >= 5) {
      validatePromo({ code: debouncedCode, orderTotal, customerPhone: debouncedPhone, itemsInCart });
    } else {
      reset();
    }
  }, [debouncedCode, debouncedPhone, orderTotal, itemsInCart, validatePromo, reset]);

  return (
    <FadeIn className="w-full">
      <Div vitri="col_none" className="w-full gap-6">
        
        {/* Header */}
        <Div vitri="row_between" className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <Div vitri="col_none" className="gap-1">
            <H variant="text_black" className="text-xl font-bold">POS: Áp dụng Mã Khuyến Mãi</H>
            <p className="text-gray-500 text-sm">Hệ thống sẽ kiểm tra chéo hạng thành viên, khung giờ và các món ăn trong bill.</p>
          </Div>
          <Div vitri="col_none" className="items-end gap-1">
            <Div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-semibold gap-2 border border-blue-100">
              <span>Tổng Bill:</span>
              <span>{orderTotal.toLocaleString()} đ</span>
            </Div>
            <span className="text-xs text-gray-400">Gồm: {itemsInCart.join(', ')}</span>
          </Div>
        </Div>

        {/* Scanner Area */}
        <Div vitri="col_none" className="w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 gap-6 items-center">
          <Div className="relative w-full max-w-lg">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã (VD: VIP50, JUICEFREESHIP...)"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-xl font-bold text-center tracking-widest placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400"
            />
            <FaQrcode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl" />
            {isPending && (
              <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 text-xl animate-spin" />
            )}
          </Div>

          {/* Validation Result */}
          <Div className="w-full max-w-lg min-h-[100px] flex flex-col gap-4">
            {/* Yêu cầu SĐT nếu mã VIP/NEW */}
            {data?.requiresPhone && !data?.success && (
              <FadeIn className="w-full">
                <Div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4 gap-4 items-center">
                  <FaPhoneAlt className="text-yellow-600 text-2xl shrink-0" />
                  <Div vitri="col_none" className="w-full">
                    <span className="font-semibold text-yellow-800">Cần xác minh danh tính</span>
                    <span className="text-yellow-700 text-sm mb-2">{data.message}</span>
                    <input 
                      type="text"
                      placeholder="Nhập SĐT khách hàng (VD: 0987654321)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    />
                  </Div>
                </Div>
              </FadeIn>
            )}

            {data?.success && (
              <FadeIn className="w-full">
                <Div className="w-full bg-green-50 border border-green-200 rounded-xl p-4 gap-4 items-center">
                  <FaCheckCircle className="text-green-500 text-3xl shrink-0" />
                  <Div vitri="col_none" className="w-full">
                    <span className="font-semibold text-green-800">{data.message}</span>
                    <span className="text-green-600 text-sm">Hệ thống đã khớp điều kiện (Món ăn, Hạng thành viên, Khung giờ).</span>
                  </Div>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap">
                    Xác nhận
                  </button>
                </Div>
              </FadeIn>
            )}

            {error && (
              <FadeIn className="w-full">
                <Div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 gap-4 items-center">
                  <FaTimesCircle className="text-red-500 text-3xl shrink-0" />
                  <Div vitri="col_none" className="w-full">
                    <span className="font-semibold text-red-800">Khước từ thanh toán</span>
                    <span className="text-red-600 text-sm">{(error as Error).message}</span>
                  </Div>
                </Div>
              </FadeIn>
            )}
          </Div>

        </Div>
      </Div>
    </FadeIn>
  );
};
