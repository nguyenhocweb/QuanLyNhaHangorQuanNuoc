"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pushNotificationSchema, PushNotificationValues } from "../schema/notification.push.schema";
import { usePushNotification } from "../hooks/usePushNotification";
import { Input, Select, Button } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import axiosClient from "@/src/core/api/axios-instance";
import useDebounce from "@/src/core/hooks/useDebounce";
import { FaPaperPlane, FaTimes } from "react-icons/fa";

type OptionType = { id: string; name: string; email?: string };

export const PushNotificationForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PushNotificationValues>({
    resolver: zodResolver(pushNotificationSchema) as any,
    defaultValues: {
      targetType: "ALL_SYSTEM",
      type: "SYSTEM",
      isAllOfType: false,
      targetIds: []
    }
  });

  const { mutate: pushNotification, isPending } = usePushNotification(onSuccess);
  
  const targetType = watch("targetType");
  const isAllOfType = watch("isAllOfType");
  const targetIds = watch("targetIds") || [];
  
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce({ value: searchTerm, delay: 500 });
  
  const [targetOptions, setTargetOptions] = useState<OptionType[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue("targetIds", []);
    setValue("isAllOfType", false);
    setSearchTerm("");
    setTargetOptions([]);
    setSelectedOptions([]);
  }, [targetType, setValue]);

  useEffect(() => {
    const fetchOptions = async () => {
      if (targetType === "ALL_SYSTEM" || isAllOfType) return;
      setIsLoadingOptions(true);
      try {
        let endpoint = "";
        if (targetType === "INDIVIDUAL_USER") endpoint = "/system-admin/account";
        if (targetType === "RESTAURANT") endpoint = "/system-admin/restaurants";
        if (targetType === "BRAND") endpoint = "/system-admin/brand";

        const queryParams: any = { page: 1, limit: 20 };
        if (debouncedSearch && debouncedSearch.trim() !== "") {
          queryParams.search = debouncedSearch;
        }

        const res = await axiosClient.get(endpoint, {
          params: queryParams
        });

        const dataList = 
          res.data?.metadata?.data || res.data?.data || 
          res.data?.metadata?.users || res.data?.users || 
          res.data?.metadata?.restaurants || res.data?.restaurants || 
          res.data?.metadata?.brands || res.data?.brands || 
          res.data?.metadata || res.data || [];
        
        setTargetOptions(dataList.map((item: any) => ({
          id: item.id || item._id,
          name: item.name || item.fullName || item.title || "Không tên",
          email: item.email
        })));
      } catch (error) {
        console.error("Lỗi lấy danh sách đối tượng", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, [targetType, debouncedSearch, isAllOfType]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSelectOption = (option: OptionType) => {
    const isSelected = selectedOptions.find(o => o.id === option.id);
    let newSelected;
    if (isSelected) {
      newSelected = selectedOptions.filter(o => o.id !== option.id);
    } else {
      newSelected = [...selectedOptions, option];
    }
    setSelectedOptions(newSelected);
    setValue("targetIds", newSelected.map(o => o.id));
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const removeOption = (idToRemove: string) => {
    const newSelected = selectedOptions.filter(o => o.id !== idToRemove);
    setSelectedOptions(newSelected);
    setValue("targetIds", newSelected.map(o => o.id));
  };

  const onSubmit = (data: PushNotificationValues) => {
    pushNotification(data);
  };

  return (
    <FadeIn>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6 w-full relative">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <FaPaperPlane className="text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Tạo thông báo mới</h2>
            <p className="text-sm text-gray-500">Gửi thông báo chủ động đến người dùng hoặc toàn hệ thống</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Loại thông báo <span className="text-red-500">*</span></label>
            <Select {...register("type")} className="w-full">
              <option value="SYSTEM">Hệ thống</option>
              <option value="PROMOTION">Khuyến mãi</option>
              <option value="ORDER">Đơn hàng</option>
              <option value="RESERVATION">Đặt bàn</option>
            </Select>
            {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Đối tượng nhận <span className="text-red-500">*</span></label>
            <Select {...register("targetType")} className="w-full">
              <option value="ALL_SYSTEM">Toàn bộ hệ thống</option>
              <option value="INDIVIDUAL_USER">Người dùng</option>
              <option value="BRAND">Thương hiệu</option>
              <option value="RESTAURANT">Nhà hàng</option>
            </Select>
            {errors.targetType && <p className="text-xs text-red-500">{errors.targetType.message}</p>}
          </div>
        </div>

        {targetType !== "ALL_SYSTEM" && (
          <FadeIn delay={0.1}>
            <div className="flex flex-col gap-3 p-5 bg-gray-50/50 rounded-xl border border-gray-100 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Chọn {targetType === "INDIVIDUAL_USER" ? "Người dùng" : targetType === "BRAND" ? "Thương hiệu" : "Nhà hàng"} <span className="text-red-500">*</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-indigo-700 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                  <input type="checkbox" {...register("isAllOfType")} className="w-4 h-4 text-indigo-600 rounded border-indigo-300 focus:ring-indigo-500" />
                  Gửi tất cả {targetType === "INDIVIDUAL_USER" ? "người dùng" : targetType === "BRAND" ? "thương hiệu" : "nhà hàng"}
                </label>
              </div>

              {!isAllOfType && (
                <div className="relative" ref={dropdownRef}>
                  <div className="min-h-[46px] w-full border border-gray-300 rounded-xl px-2 py-1.5 bg-white flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                    {selectedOptions.map(opt => (
                      <span key={opt.id} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1.5 rounded-lg text-sm font-medium border border-indigo-100">
                        {opt.name}
                        <button type="button" onClick={() => removeOption(opt.id)} className="text-indigo-400 hover:text-indigo-600">
                          <FaTimes size={12} />
                        </button>
                      </span>
                    ))}
                    
                    <input 
                      type="text"
                      placeholder={selectedOptions.length === 0 ? "Nhập tên hoặc email để tìm..." : ""}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      className="flex-1 min-w-[150px] outline-none text-sm bg-transparent px-2"
                    />
                  </div>

                  {isDropdownOpen && (searchTerm || targetOptions.length > 0) && (
                    <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 max-h-60 overflow-auto custom-scrollbar">
                      {isLoadingOptions ? (
                        <div className="p-4 text-center text-sm text-gray-500">Đang tìm kiếm...</div>
                      ) : targetOptions.length > 0 ? (
                        <div className="py-2">
                          {targetOptions.map((opt) => {
                            const isSelected = selectedOptions.some(o => o.id === opt.id);
                            return (
                              <div 
                                key={opt.id}
                                onClick={() => toggleSelectOption(opt)}
                                className={`px-4 py-2.5 cursor-pointer text-sm flex items-center justify-between transition-colors ${
                                  isSelected ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50 text-gray-700"
                                }`}
                              >
                                <div>
                                  <p className="font-medium">{opt.name}</p>
                                  {opt.email && <p className="text-xs opacity-75">{opt.email}</p>}
                                </div>
                                {isSelected && <span className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0 border-2 border-indigo-100"></span>}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500">Không tìm thấy kết quả phù hợp</div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {errors.targetIds && <p className="text-xs text-red-500">{errors.targetIds.message}</p>}
            </div>
          </FadeIn>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Tiêu đề thông báo <span className="text-red-500">*</span></label>
          <Input placeholder="Nhập tiêu đề..." {...register("title")} />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Nội dung chi tiết <span className="text-red-500">*</span></label>
          <textarea 
            placeholder="Nhập nội dung thông báo..." 
            {...register("body")} 
            className="min-h-[120px] resize-none w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
          />{errors.body && <p className="text-xs text-red-500">{errors.body.message}</p>}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button 
            type="submit" 
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 font-medium"
          >
            {isPending ? "Đang gửi..." : (
              <>
                <FaPaperPlane className="text-sm" />
                Gửi thông báo
              </>
            )}
          </Button>
        </div>
      </form>
    </FadeIn>
  );
};
