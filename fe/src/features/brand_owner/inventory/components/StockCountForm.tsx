"use client"
import React, { useEffect } from 'react'
import { Div, H, Button, InputBox } from '@/src/core/components/ui'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createStockCountSchema, CreateStockCountFormValues } from '../schemas/stock_count.schema'
import { FaTrash, FaPlus, FaCalculator } from 'react-icons/fa'
import { useGetRestaurants } from '../../restaurants/hook/useGetRestaurants'
import { useGetInventoryStocks } from '../hooks/useGetInventoryStocks'

interface Props {
  brandId: string;
  onSubmit: (data: CreateStockCountFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

export const StockCountForm = ({ brandId, onSubmit, onClose, isPending }: Props) => {
  const { data: restaurantsData } = useGetRestaurants(brandId)

  const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm<CreateStockCountFormValues>({
    resolver: zodResolver(createStockCountSchema) as any,
    defaultValues: {
      restaurantId: "",
      notes: "",
      items: []
    }
  });

  const selectedRestaurantId = watch("restaurantId");
  const { data: stocksData } = useGetInventoryStocks(brandId, selectedRestaurantId);
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "items"
  });

  const handleAutoLoadStocks = () => {
    if (!stocksData?.metadata) return;
    const items = stocksData.metadata.map((stock: any) => ({
      inventoryItemId: stock.inventoryItemId,
      itemName: stock.inventoryItem?.name || "",
      unit: stock.inventoryItem?.baseUnit || "",
      systemQty: stock.quantity,
      actualQty: stock.quantity
    }));
    replace(items);
  };

  const watchItems = watch("items");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Div vitri="col_none" className="w-full gap-4 max-h-[70vh] overflow-y-auto p-1">
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-700">Chi nhánh (Kho kiểm) <span className="text-red-500">*</span></label>
          <select 
            {...register('restaurantId')}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          >
            <option value="">-- Chọn chi nhánh --</option>
            {restaurantsData?.map((res: any) => (
              <option key={res.id} value={res.id}>{res.name}</option>
            ))}
          </select>
          {errors.restaurantId && <span className="text-xs text-red-500">{errors.restaurantId.message}</span>}
        </div>

        <Div vitri="col_none" className="w-full mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
          <Div vitri="row_between" className="w-full">
            <span className="font-semibold text-gray-700">Danh sách mặt hàng kiểm kê</span>
            <Button type="button" variant="white" sizea="p4_2" onClick={handleAutoLoadStocks} disabled={!selectedRestaurantId} className="gap-2 text-sm text-blue-600 border-blue-200 hover:bg-blue-50">
              <FaCalculator size={12} /> Tải tồn kho hiện tại
            </Button>
          </Div>
          
          {fields.map((field: any, index) => {
            const sysQty = watchItems[index]?.systemQty || 0;
            const actQty = watchItems[index]?.actualQty ?? sysQty;
            const discrepancy = actQty - sysQty;
            
            return (
              <Div key={field.id} className="w-full grid grid-cols-12 gap-3 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="col-span-4 flex flex-col">
                  <span className="text-sm font-medium text-gray-800">{field.itemName}</span>
                  <span className="text-xs text-gray-500">ĐVT: {field.unit}</span>
                  <input type="hidden" {...register(`items.${index}.inventoryItemId` as const)} />
                  <input type="hidden" {...register(`items.${index}.systemQty` as const, { valueAsNumber: true })} />
                </div>
                <div className="col-span-3 flex flex-col text-center">
                  <span className="text-xs text-gray-500 mb-1">Tồn hệ thống</span>
                  <span className="text-sm font-semibold">{sysQty}</span>
                </div>
                <div className="col-span-3 flex flex-col gap-1">
                  <InputBox
                    label="Thực tế"
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.actualQty` as const, { valueAsNumber: true })}
                    error={errors.items?.[index]?.actualQty?.message}
                  />
                </div>
                <div className="col-span-2 flex flex-col text-center items-end pe-2">
                  <span className="text-xs text-gray-500 mb-1">Độ lệch</span>
                  <span className={`text-sm font-bold ${discrepancy < 0 ? 'text-red-500' : discrepancy > 0 ? 'text-green-500' : 'text-gray-500'}`}>
                    {discrepancy > 0 ? '+' : ''}{discrepancy}
                  </span>
                </div>
              </Div>
            );
          })}
          {errors.items && !Array.isArray(errors.items) && <span className="text-xs text-red-500">{errors.items.message}</span>}
          {fields.length === 0 && <div className="text-sm text-gray-500 text-center py-4">Nhấn nút "Tải tồn kho hiện tại" để lấy danh sách hàng hóa.</div>}
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
            {isPending ? "Đang lưu..." : "Tạo phiếu kiểm kho"}
          </Button>
        </Div>
      </Div>
    </form>
  )
}
