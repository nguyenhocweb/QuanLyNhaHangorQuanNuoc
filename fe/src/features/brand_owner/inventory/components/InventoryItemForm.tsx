"use client"
import React, { useEffect } from 'react'
import { Div, Button } from '@/src/core/components/ui'
import { InputBox } from '@/src/core/components/ui/InputBox'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { inventoryItemSchema, InventoryItemFormValues } from '../schemas/inventory_item.schema'
import { InventoryItem } from '../types/inventory_item.type'
import { useGetSuppliers } from '../hooks/useGetSuppliers'
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store'

interface Props {
  initialData?: InventoryItem;
  onSubmit: (data: InventoryItemFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

export const InventoryItemForm = ({ initialData, onSubmit, onClose, isPending }: Props) => {
  const { activeWorkspace } = useAuthStore()
  const { data: suppliersData } = useGetSuppliers(activeWorkspace?.id)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema) as any,
    defaultValues: {
      sku: initialData?.sku || "",
      name: initialData?.name || "",
      categoryId: initialData?.categoryId || "",
      baseUnit: initialData?.baseUnit || "kg",
      minPrice: initialData?.minPrice || 0,
      maxPrice: initialData?.maxPrice || 0,
      minStockLevel: initialData?.minStockLevel || 0,
      type: initialData?.type || "MATERIAL",
      supplierId: initialData?.supplierId || "",
      isActive: initialData?.isActive !== false
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        sku: initialData.sku || "",
        name: initialData.name,
        categoryId: initialData.categoryId || "",
        baseUnit: initialData.baseUnit,
        minPrice: initialData.minPrice,
        maxPrice: initialData.maxPrice,
        minStockLevel: initialData.minStockLevel || 0,
        type: initialData.type,
        supplierId: initialData.supplierId || "",
        isActive: initialData.isActive
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Div vitri="col_none" className="w-full gap-4">
        <Div className="w-full grid grid-cols-2 gap-4">
          <InputBox
            label={<span>Tên hàng hóa <span className="text-red-500">*</span></span>}
            placeholder="Nhập tên..."
            {...register('name')}
            error={errors.name?.message}
          />
          <InputBox
            label="Mã SKU (Tự động nếu trống)"
            placeholder="Để trống sẽ tự tạo..."
            {...register('sku')}
            error={errors.sku?.message}
          />
        </Div>
        <Div className="w-full grid grid-cols-2 gap-4">
          <InputBox
            label={<span>Đơn vị tính <span className="text-red-500">*</span></span>}
            placeholder="kg, lít, cái..."
            {...register('baseUnit')}
            error={errors.baseUnit?.message}
          />
          <Div vitri="col_none" className="w-full">
            <label className="text-sm font-semibold text-gray-700 mb-1">Nhà cung cấp</label>
            <select
              {...register('supplierId')}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn nhà cung cấp (Không bắt buộc) --</option>
              {suppliersData?.metadata?.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </Div>
        </Div>
        <Div className="w-full grid grid-cols-3 gap-4">
          <InputBox
            label="Giá tối thiểu (VND)"
            type="number"
            {...register('minPrice', { valueAsNumber: true })}
            error={errors.minPrice?.message}
          />
          <InputBox
            label="Giá tối đa (VND)"
            type="number"
            {...register('maxPrice', { valueAsNumber: true })}
            error={errors.maxPrice?.message}
          />
          <InputBox
            label="Mức tối thiểu"
            type="number"
            {...register('minStockLevel', { valueAsNumber: true })}
            error={errors.minStockLevel?.message}
          />
        </Div>
        <Div className="w-full grid grid-cols-2 gap-4">
          <Div vitri="col_none" className="w-full">
            <label className="text-sm font-semibold text-gray-700 mb-1">Loại nguyên liệu</label>
            <select
              {...register('type')}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="INGREDIENT">Nguyên liệu</option>
              <option value="MATERIAL">Vật tư</option>
              <option value="OTHER">Khác</option>
            </select>
          </Div>
          <Div vitri="col_none" className="w-full">
            <label className="text-sm font-semibold text-gray-700 mb-1">Trạng thái</label>
            <select
              {...register('isActive', { 
                setValueAs: v => v === 'true' 
              })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Khả dụng</option>
              <option value="false">Ngừng sử dụng</option>
            </select>
          </Div>
        </Div>
        <Div vitri="row_end" className="w-full gap-2 mt-4 pt-4 border-t border-gray-100">
          <Button type="button" variant="gray_hover" sizea="p4_2" onClick={onClose} disabled={isPending}>Hủy</Button>
          <Button type="submit" variant="green" sizea="p4_2" disabled={isPending}>
            {isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </Div>
      </Div>
    </form>
  )
}
