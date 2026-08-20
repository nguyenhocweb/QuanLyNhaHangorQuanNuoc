"use client"
import React, { useState } from 'react'
import { Div, H, Button } from '@/src/core/components/ui'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaTrash, FaPlus } from 'react-icons/fa'
import { useGetRestaurants } from '../../restaurants/hook/useGetRestaurants'
import { useGetInventoryItems } from '../hooks/useGetInventoryItems'

const schema = z.object({
  fromRestaurantId: z.string().min(1, "Vui lòng chọn Kho xuất"),
  toRestaurantId: z.string().min(1, "Vui lòng chọn Kho nhận"),
  notes: z.string().optional(),
  items: z.array(z.object({
    inventoryItemId: z.string().min(1, "Vui lòng chọn mặt hàng"),
    transferQty: z.number().min(0.01, "Số lượng phải lớn hơn 0")
  })).min(1, "Vui lòng thêm ít nhất 1 mặt hàng")
}).refine(data => data.fromRestaurantId !== data.toRestaurantId, {
  message: "Kho xuất và kho nhận không được trùng nhau",
  path: ["toRestaurantId"]
})

type FormData = z.infer<typeof schema>

export const StockTransferForm = ({ brandId, onSubmit, onClose, isPending }: any) => {
  const { data: restaurantsData } = useGetRestaurants(brandId)
  const { data: itemsData } = useGetInventoryItems(brandId)

  const { control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      fromRestaurantId: '',
      toRestaurantId: '',
      notes: '',
      items: [{ inventoryItemId: '', transferQty: 1 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Div vitri="col_none" className="w-full">
          <label className="text-sm font-semibold text-gray-700 mb-1">Từ Kho Xuất <span className="text-red-500">*</span></label>
          <Controller
            name="fromRestaurantId"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Chọn kho xuất --</option>
                {restaurantsData?.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            )}
          />
          {errors.fromRestaurantId && <span className="text-red-500 text-xs mt-1">{errors.fromRestaurantId.message}</span>}
        </Div>

        <Div vitri="col_none" className="w-full">
          <label className="text-sm font-semibold text-gray-700 mb-1">Đến Kho Nhận <span className="text-red-500">*</span></label>
          <Controller
            name="toRestaurantId"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Chọn kho nhận --</option>
                {restaurantsData?.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            )}
          />
          {errors.toRestaurantId && <span className="text-red-500 text-xs mt-1">{errors.toRestaurantId.message}</span>}
        </Div>
      </div>

      <Div vitri="col_none" className="w-full">
        <label className="text-sm font-semibold text-gray-700 mb-1">Ghi chú</label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <input {...field} placeholder="VD: Chuyển hàng thiếu cho CN Hà Nội" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          )}
        />
      </Div>

      <H className="text-sm font-bold text-gray-700 mt-2 border-b pb-2">Danh sách hàng hóa <span className="text-red-500">*</span></H>
      {errors.items?.root && <span className="text-red-500 text-xs">{errors.items.root.message}</span>}

      <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2">
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <Div vitri="col_none" className="flex-1">
              <label className="text-xs font-semibold text-gray-600 mb-1">Mặt hàng</label>
              <Controller
                name={`items.${index}.inventoryItemId`}
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200">
                    <option value="">-- Chọn hàng --</option>
                    {itemsData?.metadata?.map((i: any) => (
                      <option key={i.id} value={i.id}>{i.name} ({i.baseUnit})</option>
                    ))}
                  </select>
                )}
              />
              {errors.items?.[index]?.inventoryItemId && <span className="text-red-500 text-xs mt-1">{errors.items[index]?.inventoryItemId?.message}</span>}
            </Div>

            <Div vitri="col_none" className="w-32">
              <label className="text-xs font-semibold text-gray-600 mb-1">SL Xuất</label>
              <Controller
                name={`items.${index}.transferQty`}
                control={control}
                render={({ field }) => (
                  <input type="number" step="any" min="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200" />
                )}
              />
              {errors.items?.[index]?.transferQty && <span className="text-red-500 text-xs mt-1">{errors.items[index]?.transferQty?.message}</span>}
            </Div>

            <button type="button" onClick={() => remove(index)} className="mt-6 text-red-500 hover:text-red-700 p-2">
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" sizea="p3_1" onClick={() => append({ inventoryItemId: '', transferQty: 1 })} className="self-start text-sm gap-2">
        <FaPlus /> Thêm dòng
      </Button>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" sizea="p4_2" onClick={onClose}>Hủy</Button>
        <Button type="submit" variant="blue" sizea="p4_2" disabled={isPending}>{isPending ? 'Đang lưu...' : 'Tạo phiếu'}</Button>
      </div>
    </form>
  )
}
