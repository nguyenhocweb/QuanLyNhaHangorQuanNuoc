"use client"
import React, { useEffect } from 'react'
import { Div, H, Button, InputBox } from '@/src/core/components/ui'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPurchaseOrderSchema, CreatePurchaseOrderFormValues } from '../schemas/purchase_order.schema'
import { FaTrash, FaPlus } from 'react-icons/fa'
import { useGetRestaurants } from '../../restaurants/hook/useGetRestaurants'
import { useGetSuppliers } from '../hooks/useGetSuppliers'
import { useGetInventoryItems } from '../hooks/useGetInventoryItems'
import { useUpdateCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/useUpdateCloudinary"
import { FiUploadCloud } from "react-icons/fi"
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  brandId: string;
  onSubmit: (data: CreatePurchaseOrderFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

export const PurchaseOrderForm = ({ brandId, onSubmit, onClose, isPending }: Props) => {
  const { data: restaurantsData } = useGetRestaurants(brandId)
  const { data: suppliersData } = useGetSuppliers(brandId)
  const { data: itemsData } = useGetInventoryItems(brandId)
  
  const { mutateAsync: uploadSingle } = useUpdateCloudinary()
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null)
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<CreatePurchaseOrderFormValues>({
    resolver: zodResolver(createPurchaseOrderSchema) as any,
    defaultValues: {
      restaurantId: "",
      supplierId: "",
      items: [{ inventoryItemId: "", orderQty: 1, unitPrice: 0 }],
      notes: ""
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchItems = watch("items");
  const selectedSupplierId = watch("supplierId");
  const totalAmount = watchItems.reduce((acc, item) => acc + (item.orderQty * item.unitPrice || 0), 0);

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInvoiceFile(file);
      setInvoicePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (data: CreatePurchaseOrderFormValues) => {
    try {
      setIsUploading(true);
      let invoiceUrl = "";
      
      if (invoiceFile) {
        const toastId = toast.loading("Đang tải ảnh hóa đơn...");
        invoiceUrl = await uploadSingle({
          folder: `restaurants/${data.restaurantId}/invoice`,
          file: invoiceFile,
          public_idfe: `invoice_${Date.now()}`
        });
        toast.dismiss(toastId);
      }
      
      data.invoiceImageUrl = invoiceUrl;
      onSubmit(data);
    } catch (error) {
      toast.error("Lỗi khi upload ảnh hóa đơn");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full">
      <Div vitri="col_none" className="w-full gap-4 max-h-[70vh] overflow-y-auto p-1">
        <Div className="w-full grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700">Chi nhánh nhận hàng <span className="text-red-500">*</span></label>
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
          
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700">Nhà cung cấp <span className="text-red-500">*</span></label>
            <select 
              {...register('supplierId')}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            >
              <option value="">-- Chọn nhà cung cấp --</option>
              {suppliersData?.metadata?.map((sup: any) => (
                <option key={sup.id} value={sup.id}>{sup.name}</option>
              ))}
            </select>
            {errors.supplierId && <span className="text-xs text-red-500">{errors.supplierId.message}</span>}
          </div>
        </Div>

        <Div vitri="col_none" className="w-full mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
          <Div vitri="row_between" className="w-full">
            <span className="font-semibold text-gray-700">Danh sách mặt hàng nhập</span>
            <Button type="button" variant="white" sizea="p4_2" onClick={() => append({ inventoryItemId: "", orderQty: 1, unitPrice: 0 })} className="gap-2 text-sm text-blue-600 border-blue-200 hover:bg-blue-50">
              <FaPlus size={12} /> Thêm mặt hàng
            </Button>
          </Div>
          
          {fields.map((field, index) => (
            <Div key={field.id} className="w-full grid grid-cols-12 gap-3 items-start bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="col-span-5 flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Mặt hàng</label>
                <select 
                  {...register(`items.${index}.inventoryItemId` as const)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                >
                  <option value="">-- Chọn mặt hàng --</option>
                  {itemsData?.metadata
                    ?.filter((item: any) => item.isActive !== false && (!selectedSupplierId || item.supplierId === selectedSupplierId))
                    .map((item: any) => (
                    <option key={item.id} value={item.id}>{item.name} ({item.baseUnit})</option>
                  ))}
                </select>
                {errors.items?.[index]?.inventoryItemId && <span className="text-[10px] text-red-500">{errors.items[index]?.inventoryItemId?.message}</span>}
              </div>
              <div className="col-span-3 flex flex-col gap-1">
                <InputBox
                  label="Số lượng"
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.orderQty` as const, { valueAsNumber: true })}
                  error={errors.items?.[index]?.orderQty?.message}
                />
              </div>
              <div className="col-span-3 flex flex-col gap-1">
                <InputBox
                  label="Đơn giá"
                  type="number"
                  {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true })}
                  error={errors.items?.[index]?.unitPrice?.message}
                />
              </div>
              <div className="col-span-1 flex items-end justify-center pb-2">
                <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 transition-colors p-2" title="Xóa">
                  <FaTrash />
                </button>
              </div>
            </Div>
          ))}
          {errors.items && !Array.isArray(errors.items) && <span className="text-xs text-red-500">{errors.items.message}</span>}
          
          <Div vitri="row_between" className="w-full mt-2 pt-3 border-t border-gray-200">
            <span className="font-medium text-gray-600">Tổng tiền dự kiến:</span>
            <span className="text-lg font-bold text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
          </Div>
        </Div>

        <Div className="w-full mt-2">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Hình ảnh hóa đơn</label>
          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 border-dashed rounded-xl cursor-pointer overflow-hidden relative`}>
            {invoicePreview ? (
              <img src={invoicePreview} alt="Invoice" className="w-full h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">Tải ảnh hóa đơn lên</p>
              </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleInvoiceChange} />
          </label>
        </Div>

        <InputBox
          label="Ghi chú đơn hàng"
          placeholder="Nhập ghi chú..."
          {...register('notes')}
          error={errors.notes?.message}
        />
        
        <Div vitri="row_end" className="w-full gap-2 mt-4 pt-4 border-t border-gray-100">
          <Button type="button" variant="gray_hover" sizea="p4_2" onClick={onClose} disabled={isPending}>Hủy</Button>
          <Button type="submit" variant="green" sizea="p4_2" disabled={isPending}>
            {isPending ? "Đang lưu..." : "Tạo đơn nhập"}
          </Button>
        </Div>
      </Div>
    </form>
  )
}
