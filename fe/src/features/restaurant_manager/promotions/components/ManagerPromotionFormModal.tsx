import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { promotionCreateSchema, PromotionCreateFormValues } from '../schema/promotion.create.schema';
import { useCreatePromotion } from '../hook/useCreatePromotion';
import { Div, H } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { FaTimes, FaArrowRight, FaArrowLeft, FaCheck, FaUtensils } from 'react-icons/fa';
import { useUpdatePromotion } from '../hook/useUpdatePromotion';
import { useGetPromotionById } from '../hook/useGetPromotionById';
import { useGetRestaurantMenu } from '@/src/features/quan_ly_nha_hang/menus/hook/useGetRestaurantMenu';

interface ManagerPromotionFormModalProps {
  open: boolean;
  onClose: () => void;
  restaurantId: string;
  editingId?: string | null;
}

const DAYS_OF_WEEK = [
  { value: 'MONDAY', label: 'Thứ 2' },
  { value: 'TUESDAY', label: 'Thứ 3' },
  { value: 'WEDNESDAY', label: 'Thứ 4' },
  { value: 'THURSDAY', label: 'Thứ 5' },
  { value: 'FRIDAY', label: 'Thứ 6' },
  { value: 'SATURDAY', label: 'Thứ 7' },
  { value: 'SUNDAY', label: 'CN' },
];



export const ManagerPromotionFormModal = ({ open, onClose, restaurantId, editingId }: ManagerPromotionFormModalProps) => {
  const [step, setStep] = useState(1);
  const [canSubmit, setCanSubmit] = useState(false);
  
  const { mutate: createPromotion, isPending: isCreating } = useCreatePromotion();
  const { mutate: updatePromotion, isPending: isUpdating } = useUpdatePromotion();
  const isPending = isCreating || isUpdating;

  const { data: menuResponse, isLoading: isLoadingMenu } = useGetRestaurantMenu(restaurantId, { limit: 1000, isAvailable: true });
  const menuItems = menuResponse?.metadata?.items || [];

  const { data: promotionEditData, isLoading: isLoadingPromotion } = useGetPromotionById(editingId || null);

  React.useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => setCanSubmit(true), 500);
      return () => clearTimeout(timer);
    } else {
      setCanSubmit(false);
    }
  }, [step]);

  const { register, handleSubmit, control, watch, setValue, getFieldState, formState: { errors }, trigger, reset } = useForm<PromotionCreateFormValues>({
    resolver: zodResolver(promotionCreateSchema) as any,
    defaultValues: {
      discountType: 'FIXED_AMOUNT',
      targetAudience: 'ALL',
      daysOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
      menuItemIds: [],
    }
  });

  React.useEffect(() => {
    if (editingId && promotionEditData) {
      reset({
        code: promotionEditData.code,
        description: promotionEditData.description || '',
        discountType: promotionEditData.discountType,
        discountValue: promotionEditData.discountValue,
        minOrderValue: promotionEditData.minOrderValue || undefined,
        maxDiscount: promotionEditData.maxDiscount || undefined,
        validFrom: (promotionEditData.validFrom ? new Date(promotionEditData.validFrom).toISOString().split('T')[0] : '') as unknown as Date,
        validUntil: (promotionEditData.validUntil ? new Date(promotionEditData.validUntil).toISOString().split('T')[0] : '') as unknown as Date,
        daysOfWeek: promotionEditData.daysOfWeek || [],
        timeStart: promotionEditData.timeStart || '',
        timeEnd: promotionEditData.timeEnd || '',
        targetAudience: promotionEditData.conditions?.targetAudience || 'ALL',
        usageLimit: promotionEditData.usageLimit || undefined,
        usageLimitPerUser: promotionEditData.usageLimitPerUser || undefined,
        maxBudget: promotionEditData.maxBudget || undefined,
        menuItemIds: promotionEditData.promotionMenuItems?.map((pmi: any) => pmi.menuItemId) || [],
      });
    } else if (!editingId && open) {
      reset({
        discountType: 'FIXED_AMOUNT',
        targetAudience: 'ALL',
        daysOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
        menuItemIds: [],
      });
    }
  }, [editingId, promotionEditData, reset, open]);

  const discountType = watch('discountType');
  const selectedItems = watch('menuItemIds') || [];
  const selectedDays = watch('daysOfWeek') || [];

  const handleNext = async () => {
    if (step === 1) {
      const fields = ['code', 'description', 'discountType', 'discountValue', 'minOrderValue', 'maxDiscount'] as any[];
      await trigger(fields);
      const hasError = fields.some(field => getFieldState(field).invalid);
      if (!hasError) setStep(2);
    } else if (step === 2) {
      const fields = ['validFrom', 'validUntil', 'daysOfWeek', 'timeStart', 'timeEnd', 'targetAudience', 'usageLimit', 'usageLimitPerUser', 'maxBudget'] as any[];
      await trigger(fields);
      const hasError = fields.some(field => getFieldState(field).invalid);
      if (!hasError) setStep(3);
    }
  };

  const onSubmit = (data: PromotionCreateFormValues) => {
    if (editingId) {
      updatePromotion({ id: editingId, data: { ...data, restaurantId } }, {
        onSuccess: () => {
          setStep(1);
          onClose();
        }
      });
    } else {
      createPromotion({ ...data, restaurantId }, {
        onSuccess: () => {
          setStep(1);
          onClose();
        }
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <FadeIn className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-100">
        {/* Header */}
        <Div vitri="row_between" className="p-6 border-b border-slate-100 bg-slate-50/50">
          <Div vitri="col_none" className="gap-1">
            <H variant="text_black" className="text-xl font-bold tracking-tight text-slate-800">
              {editingId ? 'Cập Nhật Khuyến Mãi' : 'Tạo Khuyến Mãi Mới'}
            </H>
            <p className="text-sm text-slate-500 font-medium">Thiết lập mã giảm giá áp dụng riêng cho chi nhánh này.</p>
          </Div>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all bg-white shadow-sm border border-slate-200">
            <FaTimes />
          </button>
        </Div>

        {/* Stepper Indicator */}
        <Div className="w-full px-8 pt-6 pb-4 flex justify-between items-center relative">
          {/* Background Line */}
          <div className="absolute left-14 right-14 top-10 h-0.5 bg-slate-200 -z-10" />
          {/* Active Line */}
          <div 
            className="absolute left-14 top-10 h-0.5 bg-indigo-600 transition-all duration-500 -z-10" 
            style={{ width: `calc(${(step - 1) / 2 * 100}% - 3rem)` }}
          />

          {[1, 2, 3].map((s) => (
            <Div key={s} vitri="col_none" className="items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                  step >= s 
                    ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.5)] border-2 border-white' 
                    : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                }`}
              >
                {step > s ? <FaCheck /> : s}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${step >= s ? 'text-indigo-600' : 'text-slate-400'}`}>
                {s === 1 ? 'Cốt lõi' : s === 2 ? 'Ràng buộc' : 'Món ăn'}
              </span>
            </Div>
          ))}
        </Div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <form id="promoForm" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            
            {/* BƯỚC 1: THÔNG TIN CỐT LÕI */}
            {step === 1 && (
              <FadeIn className="w-full flex flex-col gap-5">
                {/* Định danh */}
                <div className="flex flex-col gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Định Danh Chiến Dịch</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Mã Code <span className="text-red-500">*</span></label>
                      <div className="relative w-full">
                        <input 
                          {...register('code')} 
                          placeholder="VD: SUMMER2026" 
                          className="w-full p-2.5 pr-28 bg-slate-50 border border-slate-200 rounded-xl uppercase font-bold tracking-wider text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400" 
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const randomCode = 'KM' + Math.random().toString(36).substring(2, 8).toUpperCase();
                            setValue('code', randomCode, { shouldValidate: true });
                          }}
                          className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold rounded-lg transition-all shadow-sm"
                        >
                          Tạo ngẫu nhiên
                        </button>
                      </div>
                      {errors.code && <span className="text-red-500 text-xs font-medium">{errors.code.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Loại Giảm Giá <span className="text-red-500">*</span></label>
                      <select {...register('discountType')} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer">
                        <option value="FIXED_AMOUNT">Tiền mặt (VNĐ)</option>
                        <option value="PERCENTAGE">Phần trăm (%)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Cấu hình giá */}
                <div className="flex flex-col gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Cấu Hình Giá Trị</h4>
                  <div className={`grid gap-6 ${discountType === 'PERCENTAGE' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Giá trị giảm <span className="text-red-500">*</span></label>
                      <input type="number" {...register('discountValue', { valueAsNumber: true })} placeholder={discountType === 'PERCENTAGE' ? 'VD: 10' : 'VD: 50000'} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                      {errors.discountValue && <span className="text-red-500 text-xs font-medium">{errors.discountValue.message}</span>}
                    </div>
                    {discountType === 'PERCENTAGE' && (
                      <div className="flex flex-col gap-1.5 animate-in fade-in zoom-in-95">
                        <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Mức giảm tối đa <span className="text-red-500">*</span></label>
                        <input type="number" {...register('maxDiscount', { valueAsNumber: true })} placeholder="Giới hạn chống lỗ" className="w-full p-2.5 bg-red-50 border border-red-200 rounded-xl font-bold text-red-800 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder-red-300" />
                        {errors.maxDiscount && <span className="text-red-500 text-xs font-medium">{errors.maxDiscount.message}</span>}
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5 animate-in fade-in zoom-in-95">
                      <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Đơn tối thiểu (VNĐ)</label>
                      <input type="number" {...register('minOrderValue', { valueAsNumber: true })} placeholder="VD: 100000" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                      {errors.minOrderValue && <span className="text-red-500 text-xs font-medium">{errors.minOrderValue.message}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Mô tả chi tiết</label>
                    <textarea {...register('description')} rows={2} placeholder="Mô tả nội bộ hoặc cho thu ngân xem..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none custom-scrollbar"></textarea>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* BƯỚC 2: RÀNG BUỘC THỜI GIAN & KHÁCH HÀNG */}
            {step === 2 && (
              <FadeIn className="w-full flex flex-col gap-5">
                {/* Thời gian */}
                <div className="flex flex-col gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Khung Thời Gian</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Từ Ngày <span className="text-red-500">*</span></label>
                      <input type="date" {...register('validFrom')} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                      {errors.validFrom && <span className="text-red-500 text-xs font-medium">{errors.validFrom.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Đến Ngày <span className="text-red-500">*</span></label>
                      <input type="date" {...register('validUntil')} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                      {errors.validUntil && <span className="text-red-500 text-xs font-medium">{errors.validUntil.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Giờ Vàng Bắt Đầu</label>
                      <input type="time" {...register('timeStart')} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Giờ Vàng Kết Thúc</label>
                      <input type="time" {...register('timeEnd')} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
                      {errors.timeEnd && <span className="text-red-500 text-xs font-medium">{errors.timeEnd.message}</span>}
                    </div>
                  </div>
                </div>

                {/* Ngày trong tuần */}
                <div className="flex flex-col gap-3 p-5 bg-slate-50/50 rounded-2xl border border-slate-200 shadow-sm">
                  <label className="font-semibold text-slate-700 text-sm">Áp dụng vào các ngày trong tuần <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map(d => {
                      const isSelected = selectedDays.includes(d.value as any);
                      return (
                        <label key={d.value} className={`flex items-center justify-center px-4 py-2 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm hover:bg-indigo-700' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'}`}>
                          <input type="checkbox" value={d.value} {...register('daysOfWeek')} className="sr-only" />
                          <span className="text-sm font-bold">{d.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.daysOfWeek && <span className="text-red-500 text-xs font-medium">{errors.daysOfWeek.message}</span>}
                </div>

                {/* Khách hàng & Ngân sách */}
                <div className="flex flex-col gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Điều Kiện & Ngân Sách</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Tệp Khách <span className="text-red-500">*</span></label>
                      <select {...register('targetAudience')} className="w-full p-2.5 bg-yellow-50 border border-yellow-200 rounded-xl font-bold text-yellow-800 focus:bg-white focus:ring-2 focus:ring-yellow-500/50 transition-all">
                        <option value="ALL">Tất cả (Public)</option>
                        <option value="VIP">Khách VIP</option>
                        <option value="NEW_CUSTOMER">Khách Mới</option>
                        <option value="STUDENT">Học sinh / SV</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Tổng Ngân Sách (VNĐ)</label>
                      <input type="number" {...register('maxBudget', { valueAsNumber: true })} placeholder="VD: 5,000,000" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                      {errors.maxBudget && <span className="text-red-500 text-xs font-medium">{errors.maxBudget.message}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Giới hạn tổng lượt dùng</label>
                      <input type="number" {...register('usageLimit', { valueAsNumber: true })} placeholder="Không giới hạn" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Số lượt / 1 Khách</label>
                      <input type="number" {...register('usageLimitPerUser', { valueAsNumber: true })} placeholder="1" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* BƯỚC 3: MÓN ĂN */}
            {step === 3 && (
              <FadeIn className="w-full flex flex-col gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-500 mt-1">
                    <FaUtensils className="text-xl" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-indigo-900 text-lg">Phạm vi áp dụng</span>
                    <span className="text-indigo-700 text-sm font-medium mt-1 leading-relaxed">Nếu bạn KHÔNG CHỌN món nào, hệ thống sẽ mặc định áp dụng mã này cho TOÀN BỘ thực đơn của nhà hàng.</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-2">
                  <span className="font-bold text-slate-700">Món ăn đã chọn:</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-bold text-sm">{selectedItems.length} món</span>
                </div>

                <div className="w-full max-h-[350px] overflow-y-auto border border-slate-200 rounded-2xl shadow-sm bg-white divide-y divide-slate-100 custom-scrollbar">
                  {isLoadingMenu ? (
                    <div className="p-8 flex flex-col items-center justify-center gap-3 text-slate-500">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-medium">Đang tải thực đơn...</span>
                    </div>
                  ) : menuItems.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-medium bg-slate-50">Nhà hàng chưa có món ăn nào.</div>
                  ) : (
                    menuItems.map(item => {
                      const isSelected = selectedItems.includes(item.id);
                      return (
                        <label key={item.id} className={`flex items-center p-4 cursor-pointer gap-4 transition-colors duration-200 ${isSelected ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}`}>
                          <div className={`w-5 h-5 flex items-center justify-center rounded-md border-2 transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                            {isSelected && <FaCheck className="text-white text-[10px]" />}
                            <input 
                              type="checkbox" 
                              value={item.id} 
                              {...register('menuItemIds')}
                              className="sr-only" 
                            />
                          </div>
                          <div className="flex flex-col flex-1">
                            <span className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>{item.name}</span>
                            <span className="text-xs font-medium text-slate-500 mt-0.5">
                              {item.categoryMaps?.[0]?.category?.name || 'Chưa phân loại'} • {item.basePrice.toLocaleString()}đ
                            </span>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </FadeIn>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <Div vitri="row_between" className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={() => setStep(prev => prev - 1)}
            disabled={step === 1}
            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 ${step === 1 ? 'opacity-0 cursor-default' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm hover:shadow'}`}
          >
            <FaArrowLeft /> Quay lại
          </button>
          
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5"
            >
              Tiếp tục <FaArrowRight />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
              disabled={isPending || !canSubmit}
              className="px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPending ? 'Đang lưu...' : <><FaCheck /> Lưu Chiến Dịch</>}
            </button>
          )}
        </Div>
      </FadeIn>
    </div>
  );
};
