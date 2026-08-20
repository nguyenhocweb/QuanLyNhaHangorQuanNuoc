"use client"
import React from 'react'
import { Div, Button, InputBox } from '@/src/core/components/ui'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createStockCountSchema, CreateStockCountFormValues } from '@/src/features/brand_owner/inventory/schemas/stock_count.schema'
import { FaCalculator } from 'react-icons/fa'
import { useGetItemsForStockCount } from '../hooks/useGetItemsForStockCount'
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store'

interface Props {
  brandId: string; // Có thể bỏ nếu ko cần, nhưng tạm giữ để tương thích với ManagerInventoryDashboard
  restaurantId: string;
  initialData?: any;
  onSubmit: (data: CreateStockCountFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

export const StaffStockCountForm = ({ brandId, restaurantId, initialData, onSubmit, onClose, isPending }: Props) => {
  const { user } = useAuthStore();
  const role = user?.role || "Nhân viên"; // Lấy role từ auth store (Nhân viên hoặc Quản lý nhà hàng)

  const { register, control, handleSubmit, formState: { errors }, watch, reset } = useForm<CreateStockCountFormValues>({
    resolver: zodResolver(createStockCountSchema) as any,
    defaultValues: {
      restaurantId: restaurantId,
      notes: initialData?.notes || "",
      items: initialData?.items?.map((item: any) => ({
        inventoryItemId: item.inventoryItemId,
        itemName: item.inventoryItem?.name || "",
        unit: item.inventoryItem?.baseUnit || "",
        systemQty: item.systemQty || 0,
        actualQty: item.actualQty || 0
      })) || []
    }
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        restaurantId: restaurantId,
        notes: initialData.notes || "",
        items: initialData.items?.map((item: any) => ({
          inventoryItemId: item.inventoryItemId,
          itemName: item.inventoryItem?.name || "",
          unit: item.inventoryItem?.baseUnit || "",
          systemQty: item.systemQty || 0,
          actualQty: item.actualQty || 0
        })) || []
      });
    }
  }, [initialData, reset, restaurantId]);

  const { data: stocksData } = useGetItemsForStockCount(restaurantId, role);
  const { fields, replace } = useFieldArray({
    control,
    name: "items"
  });

  const handleAutoLoadItems = () => {
    if (!stocksData?.metadata) return;
    const items = stocksData.metadata.map((stock: any) => ({
      inventoryItemId: stock.inventoryItemId,
      itemName: stock.inventoryItem?.name || "",
      unit: stock.inventoryItem?.baseUnit || "",
      systemQty: 0, // Bắt buộc truyền để pass schema, nhưng giao diện Staff không hiển thị
      actualQty: 0 // Bắt buộc staff phải đếm và nhập số > 0
    }));
    replace(items);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Div vitri="col_none" className="w-full gap-4 max-h-[90vh] overflow-y-auto p-1">
        
        <Div vitri="col_none" className="w-full mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
          <Div vitri="row_between" className="w-full">
            <span className="font-semibold text-gray-700">Phiếu đếm kho (Blind Count)</span>
            <Button type="button" variant="white" sizea="p4_2" onClick={handleAutoLoadItems} className="gap-2 text-sm text-blue-600 border-blue-200 hover:bg-blue-50">
              <FaCalculator size={12} /> Tải danh sách mặt hàng
            </Button>
          </Div>
          
          <div className="text-xs text-amber-600 mb-2 bg-amber-50 p-2 rounded-lg border border-amber-100">
            * Vui lòng điền số lượng đếm thực tế của từng mặt hàng.
          </div>

          {fields.map((field: any, index) => {
            return (
              <Div key={field.id} className="w-full grid grid-cols-12 gap-3 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="col-span-8 flex flex-col">
                  <span className="text-sm font-medium text-gray-800">{field.itemName}</span>
                  <span className="text-xs text-gray-500">ĐVT: {field.unit}</span>
                  <input type="hidden" {...register(`items.${index}.inventoryItemId` as const)} />
                </div>
                <div className="col-span-4 flex flex-col gap-1">
                  <InputBox
                    label="SL Thực tế"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...register(`items.${index}.actualQty` as const, { valueAsNumber: true })}
                    error={errors.items?.[index]?.actualQty?.message}
                  />
                </div>
              </Div>
            );
          })}
          {errors.items && !Array.isArray(errors.items) && <span className="text-xs text-red-500">{errors.items.message}</span>}
          {fields.length === 0 && <div className="text-sm text-gray-500 text-center py-4">Nhấn nút "Tải danh sách mặt hàng" để bắt đầu đếm.</div>}
        </Div>

        <InputBox
          label="Ghi chú phiếu kiểm"
          placeholder="Nhập ghi chú..."
          {...register('notes')}
          error={errors.notes?.message}
        />
        
        <Div vitri="row_end" className="w-full gap-2 mt-4 pt-4 border-t border-gray-100">
          <Button type="button" variant="gray_hover" sizea="p4_2" onClick={onClose} disabled={isPending}>Hủy</Button>
          <Button type="submit" variant="green" sizea="p4_2" disabled={isPending}>
            {isPending ? "Đang lưu..." : "Lưu Phiếu Đếm"}
          </Button>
        </Div>
      </Div>
    </form>
  )
}
