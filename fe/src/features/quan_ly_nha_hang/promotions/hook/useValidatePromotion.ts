import { useMutation } from '@tanstack/react-query';
import { Promotion } from '../type/promotion.type';

export const useValidatePromotion = () => {
  return useMutation({
    mutationFn: async ({ code, orderTotal, customerPhone, itemsInCart }: { code: string; orderTotal: number, customerPhone?: string, itemsInCart: string[] }) => {
      // Fake API Call
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const upperCode = code.toUpperCase();
      
      // Giả lập logic chặt chẽ của Senior Pro Max Leader:
      
      if (upperCode === 'GIAM10K') {
        // Mã này yêu cầu khung giờ 14h-17h (fake check: giả sử hiện tại là 19h -> lỗi)
        const currentHour = new Date().getHours();
        if (currentHour < 14 || currentHour > 17) {
          throw new Error('Sai khung giờ áp dụng. Mã này chỉ áp dụng từ 14:00 đến 17:00.');
        }
        if (orderTotal < 100000) throw new Error('Chưa đạt giá trị hóa đơn tối thiểu 100K');
        return { success: true, discountAmount: 10000, message: 'Hợp lệ! Giảm 10.000đ', requiresPhone: false };
      }
      
      if (upperCode === 'VIP50') {
        if (!customerPhone) {
          // Bắt buộc yêu cầu SĐT để check hạng VIP
          return { success: false, requiresPhone: true, message: 'Mã VIP yêu cầu xác thực số điện thoại khách hàng.' };
        }
        // Giả lập check phone DB
        if (customerPhone !== '0987654321') {
          throw new Error('Khách hàng không thuộc hạng VIP hoặc số điện thoại không tồn tại.');
        }
        let discount = orderTotal * 0.5;
        if (discount > 100000) discount = 100000;
        return { success: true, discountAmount: discount, message: `Hợp lệ! Giảm ${discount.toLocaleString()}đ (Khách VIP)`, requiresPhone: true };
      }

      if (upperCode === 'JUICEFREESHIP') {
        // Mã này giới hạn món ăn
        const hasValidItem = itemsInCart.some(item => ['Nước Ép Cam', 'Nước Ép Dưa Hấu', 'Sinh Tố Xoài'].includes(item));
        if (!hasValidItem) {
          throw new Error('Hóa đơn không chứa món ăn hợp lệ. Yêu cầu: Nhóm Nước Ép.');
        }
        if (orderTotal < 50000) throw new Error('Chưa đạt giá trị tối thiểu 50K');
        return { success: true, discountAmount: 20000, message: 'Hợp lệ! Áp dụng thành công cho nhóm Nước Ép.', requiresPhone: false };
      }
      
      throw new Error('Mã khuyến mãi không tồn tại hoặc đã hết hạn.');
    },
  });
};
