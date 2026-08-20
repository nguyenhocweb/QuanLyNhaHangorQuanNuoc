import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { purchaseRequestSchema, PurchaseRequestFormValues } from '../schemas/purchase_request.schema';
import { Div, Button, InputBox } from '@/src/core/components/ui';
import { FaTrash, FaPlus, FaMagic } from 'react-icons/fa';

export const PurchaseRequestForm = ({ 
  restaurantId, 
  availableItems,
  stocks,
  onSubmit, 
  onClose,
  isPending 
}: {
  restaurantId: string;
  availableItems: any[];
  stocks: any[];
  onSubmit: (data: any) => void;
  onClose: () => void;
  isPending: boolean;
}) => {
  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<PurchaseRequestFormValues>({
    resolver: zodResolver(purchaseRequestSchema) as any,
    defaultValues: {
      restaurantId,
      items: [{ inventoryItemId: "", requestedQty: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const [autoFillThreshold, setAutoFillThreshold] = React.useState(10);

  const handleAutoFill = () => {
    const lowStocks = stocks.filter(s => s.quantity <= (s.inventoryItem?.minStockLevel || 0) + autoFillThreshold);
    
    if (lowStocks.length === 0) {
      alert("Không có mặt hàng nào có tồn kho thấp để tự động điền!");
      return;
    }

    const autoItems = lowStocks.map(s => {
      const minLevel = s.inventoryItem?.minStockLevel || 0;
      const targetQty = minLevel + autoFillThreshold;
      let reqQty = targetQty - s.quantity;
      if (reqQty <= 0) reqQty = 1;
      return { inventoryItemId: s.inventoryItemId, requestedQty: reqQty };
    });

    setValue('items', autoItems);

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + 3);
    setValue('expectedDate', expectedDate.toISOString().split('T')[0]);
    
    setValue('notes', 'Gần hết cần gấp');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <InputBox 
          label="Ngày dự kiến nhận hàng"
          type="date"
          {...register('expectedDate')}
          error={errors.expectedDate?.message}
        />
        <InputBox 
          label="Ghi chú / Lý do xin cấp"
          placeholder="Nhập lý do (vd: Hết hàng chạy event)"
          {...register('notes')}
          error={errors.notes?.message}
        />
      </div>

      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-700">Danh sách mặt hàng cần xin cấp <span className="text-red-500">*</span></span>
          <div className="flex gap-3 items-center">
            {/* Auto Fill Group */}
            <div className="flex items-stretch rounded-xl overflow-hidden shadow-sm border border-blue-200 transition-all hover:shadow-md">
              <div className="flex items-center bg-blue-50/50 px-3 border-r border-blue-200">
                <span className="text-sm font-medium text-blue-800">Mức bù:</span>
                <input
                  type="number"
                  min="0"
                  value={autoFillThreshold}
                  onChange={(e) => setAutoFillThreshold(Number(e.target.value) || 0)}
                  className="w-14 ml-2 px-1 py-1 text-center text-sm bg-white border border-blue-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-blue-900 font-semibold transition-all"
                  title="Sẽ tự động điền các mặt hàng có tồn kho <= mức tối thiểu + mức bù"
                />
              </div>
              <button 
                type="button" 
                onClick={handleAutoFill} 
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold flex items-center transition-colors"
              >
                <FaMagic className="mr-2" /> Tự động điền
              </button>
            </div>

            <Button type="button" variant="outline" sizea="p4_2" onClick={() => append({ inventoryItemId: "", requestedQty: 1 })} className="text-sm flex items-center shadow-sm rounded-xl border-gray-200 hover:border-gray-300">
              <FaPlus className="mr-2" /> Thêm mặt hàng
            </Button>
          </div>
        </div>
        
        {errors.items?.message && <div className="text-red-500 text-sm mb-2">{errors.items.message}</div>}

        <div className="w-full flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm relative">
              <div className="flex-1">
                <select
                  {...register(`items.${index}.inventoryItemId`)}
                  className={`w-full border rounded-lg px-3 py-2 outline-none focus:border-blue-500 ${errors.items?.[index]?.inventoryItemId ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">-- Chọn mặt hàng --</option>
                  {availableItems.map(ai => (
                    <option key={ai.id} value={ai.id}>{ai.name} ({ai.baseUnit})</option>
                  ))}
                </select>
                {errors.items?.[index]?.inventoryItemId && <span className="text-red-500 text-xs mt-1 block">{errors.items[index]?.inventoryItemId?.message}</span>}
              </div>

              <div className="w-32">
                <input
                  type="number"
                  step="0.1"
                  placeholder="SL xin"
                  {...register(`items.${index}.requestedQty`, { valueAsNumber: true })}
                  className={`w-full border rounded-lg px-3 py-2 outline-none focus:border-blue-500 ${errors.items?.[index]?.requestedQty ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.items?.[index]?.requestedQty && <span className="text-red-500 text-xs mt-1 block">{errors.items[index]?.requestedQty?.message}</span>}
              </div>

              <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-1 transition-colors">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" sizea="p4_2" onClick={onClose}>Hủy</Button>
        <Button type="submit" variant="green" sizea="p4_2" disabled={isPending}>
          {isPending ? "Đang gửi..." : "Gửi Yêu cầu"}
        </Button>
      </div>
    </form>
  )
}
