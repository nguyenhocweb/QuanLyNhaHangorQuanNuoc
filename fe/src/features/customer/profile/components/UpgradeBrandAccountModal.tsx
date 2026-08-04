"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Label, Div, H, P } from "../../../../core/components/ui";
import { FiUploadCloud, FiFile, FiCheck, FiX, FiLoader } from "react-icons/fi";
import { upgradeSchema, UpgradeFormValues } from "../schema/upgrade-schema";
import { useCreateUpgradeRequest } from "../hook/useUpgradeRequest_hook";
import { useUpdateCloudinary } from "../../../shared/cloudinary/cloudinary_hook/useUpdateCloudinary";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const UpgradeBrandAccountModal: React.FC<Props> = ({ isOpen, onClose, userId }) => {
  const [mounted, setMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: createUpgradeRequest, isPending: isCreating } = useCreateUpgradeRequest();
  const { mutateAsync: uploadSingle } = useUpdateCloudinary();

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<UpgradeFormValues>({
    resolver: zodResolver(upgradeSchema),
    defaultValues: {
      brandName: "",
      tax_code: "",
      businessLicenseFile: null
    }
  });

  const businessLicenseFile = watch("businessLicenseFile");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isCreating && !isUploading) handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isCreating, isUploading]);

  if (!isOpen || !mounted) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue("businessLicenseFile", e.target.files[0], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: UpgradeFormValues) => {
    try {
      setIsUploading(true);
      
      // Upload ảnh giấy phép lên Cloudinary
      const folder = `/users/${userId}/business_licenses`;
      const uploadedUrl = await uploadSingle({
        folder: folder,
        file: data.businessLicenseFile as File,
        public_idfe: `license_${Date.now()}`
      });

      if (!uploadedUrl) {
        throw new Error("Upload ảnh thất bại");
      }

      setIsUploading(false);

      // Gửi request nâng cấp
      await createUpgradeRequest({
        brandName: data.brandName,
        tax_code: data.tax_code,
        businessLicenseFile: data.businessLicenseFile, // fix type mismatch
        businessLicense: uploadedUrl
      } as UpgradeFormValues & { businessLicense: string });

      reset();
      onClose();
    } catch (error: any) {
      console.error(error);
      setIsUploading(false);
      // Lỗi API đã được handle trong hook, nếu là lỗi upload thì toast ở đây
      if (error.message === "Upload ảnh thất bại") {
        toast.error("Không thể tải ảnh lên. Vui lòng thử lại!");
      }
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <Div 
        variant="bg_white" 
        shape="square" 
        className="relative w-full max-w-md flex-col items-stretch overflow-hidden rounded-2xl !p-0 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="bg-amber-50 p-6 border-b border-amber-100 relative">
          <button
            type="button"
            className="absolute right-4 top-4 rounded-lg bg-white p-2 text-gray-400 hover:bg-amber-100 hover:text-amber-700 disabled:opacity-50 transition-colors"
            onClick={handleClose}
            disabled={isCreating || isUploading}
          >
            <FiX className="h-5 w-5" />
          </button>
          
          <H variant="text_black" className="text-xl font-bold text-amber-900 flex items-center gap-2">
            Đăng ký Đối tác
          </H>
          <P className="text-amber-700 mt-2 text-sm">
            Trở thành chủ thương hiệu để bắt đầu kinh doanh trên nền tảng.
          </P>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 flex flex-col w-full">
          <div className="space-y-2 flex flex-col w-full text-left">
            <Label className="text-sm font-semibold text-slate-700 w-full block">Tên thương hiệu <span className="text-red-500">*</span></Label>
            <Input
              {...register("brandName")}
              placeholder="Nhập tên thương hiệu của bạn..."
              className="rounded-lg focus-visible:ring-amber-500 w-full block"
            />
            {errors.brandName && <p className="text-red-500 text-xs mt-1">{errors.brandName.message}</p>}
          </div>

          <div className="space-y-2 flex flex-col w-full text-left">
            <Label className="text-sm font-semibold text-slate-700 w-full block">Mã số thuế</Label>
            <Input
              {...register("tax_code")}
              placeholder="Nhập mã số thuế (nếu có)..."
              className="rounded-lg focus-visible:ring-amber-500 w-full block"
            />
            {errors.tax_code && <p className="text-red-500 text-xs mt-1">{errors.tax_code.message}</p>}
          </div>

          <div className="space-y-2 flex flex-col w-full text-left">
            <Label className="text-sm font-semibold text-slate-700 w-full block">Giấy phép kinh doanh <span className="text-red-500">*</span></Label>
            
            <div className="mt-2 w-full">
              {!businessLicenseFile ? (
                <Label
                  htmlFor="businessLicenseUpload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer bg-amber-50 hover:bg-amber-100 hover:border-amber-500 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUploadCloud className="w-8 h-8 text-amber-500 mb-2" />
                    <p className="mb-2 text-sm text-amber-800"><span className="font-semibold">Click để tải ảnh lên</span></p>
                    <p className="text-xs text-amber-600/70">JPG, PNG (Tối đa 5MB)</p>
                  </div>
                  <input
                    id="businessLicenseUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
              ) : (
                <div className="relative border border-amber-200 bg-amber-50 rounded-lg p-3 flex items-center justify-between w-full">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                       <FiFile className="text-amber-700" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-amber-900 truncate">{(businessLicenseFile as File).name}</p>
                      <p className="text-xs text-amber-700">{(businessLicenseFile as File).size / 1024 > 1024 ? ((businessLicenseFile as File).size / 1024 / 1024).toFixed(2) + ' MB' : ((businessLicenseFile as File).size / 1024).toFixed(2) + ' KB'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue("businessLicenseFile", null, { shouldValidate: true })}
                    className="p-2 text-amber-700 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                  >
                    <FiX />
                  </button>
                </div>
              )}
            </div>
            {errors.businessLicenseFile && <p className="text-red-500 text-xs mt-1">{errors.businessLicenseFile.message as string}</p>}
          </div>

          <div className="pt-4 border-t mt-6 flex justify-end gap-3 w-full">
            <Button 
                type="button" 
                variant="white" 
                sizea="p4_2"
                onClick={handleClose} 
                disabled={isCreating || isUploading}
                className="w-28"
            >
              Hủy
            </Button>
            <Button 
                type="submit" 
                variant="green"
                sizea="p4_2"
                disabled={isCreating || isUploading}
                className="min-w-[120px]"
            >
              {(isUploading || isCreating) && <FiLoader className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Đang tải..." : (isCreating ? "Đang gửi..." : "Gửi yêu cầu")}
            </Button>
          </div>
        </form>
      </Div>
    </div>,
    document.body
  );
};
