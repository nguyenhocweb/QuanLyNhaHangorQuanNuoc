"use client"
import React, { useEffect } from 'react'
import { Div, H, Button } from '@/src/core/components/ui'
import { InputBox } from '@/src/core/components/ui/InputBox'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supplierSchema, SupplierFormValues } from '../schemas/supplier.schema'
import { Supplier } from '../types/supplier.type'

interface Props {
  initialData?: Supplier;
  onSubmit: (data: SupplierFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

export const SupplierForm = ({ initialData, onSubmit, onClose, isPending }: Props) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      contact: {
        contactName: initialData?.contact?.contactName || "",
        email: initialData?.contact?.email || "",
        phone: initialData?.contact?.phone || "",
        address: initialData?.contact?.address || ""
      },
      status: (initialData?.status as "ACTIVE" | "INACTIVE") || "ACTIVE"
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        taxCode: initialData.taxCode || "",
        contact: {
          contactName: initialData.contact?.contactName || "",
          email: initialData.contact?.email || "",
          phone: initialData.contact?.phone || "",
          address: initialData.contact?.address || ""
        },
        status: (initialData.status as "ACTIVE" | "INACTIVE") || "ACTIVE"
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Div vitri="col_none" className="w-full gap-4">
        <InputBox
          label={<span>Tên nhà cung cấp <span className="text-red-500">*</span></span>}
          placeholder="Nhập tên nhà cung cấp..."
          {...register('name')}
          error={errors.name?.message}
        />
        <Div className="w-full grid grid-cols-2 gap-4">
          <InputBox
            label="Mã số thuế"
            placeholder="Nhập mã số thuế..."
            {...register('taxCode')}
            error={errors.taxCode?.message}
          />
          <InputBox
            label="Tên người liên hệ"
            placeholder="Nguyễn Văn A..."
            {...register('contact.contactName')}
            error={errors.contact?.contactName?.message}
          />
        </Div>
        <Div className="w-full grid grid-cols-2 gap-4">
          <InputBox
            label={<span>Số điện thoại <span className="text-red-500">*</span></span>}
            placeholder="0912345678..."
            {...register('contact.phone')}
            error={errors.contact?.phone?.message}
          />
          <InputBox
            label="Email"
            placeholder="abc@gmail.com..."
            {...register('contact.email')}
            error={errors.contact?.email?.message}
          />
        </Div>
        <InputBox
          label="Địa chỉ"
          placeholder="Nhập địa chỉ..."
          {...register('contact.address')}
          error={errors.contact?.address?.message}
        />
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
