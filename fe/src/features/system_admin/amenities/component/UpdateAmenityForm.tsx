"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAmenitySchema, UpdateAmenityFormValues } from "../schema/amenity-schema";
import { useUpdateAmenity } from "../hook/useAmenity_hook";
import { Div, H, P, Label, Input, Button } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { IoClose } from "react-icons/io5";
import { FiLoader, FiCheckCircle, FiSave } from "react-icons/fi";
import { AMENITY_ICONS, PRESET_ICON_NAMES } from "../constants/amenity_icons";

interface Props { isOpen: boolean; onClose: () => void; initialData?: any; }

const UpdateAmenityForm: React.FC<Props> = ({ isOpen, onClose, initialData }) => {
  const { mutate: updateMutation, isPending } = useUpdateAmenity();
  
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<UpdateAmenityFormValues>({
    resolver: zodResolver(updateAmenitySchema),
    defaultValues: initialData
  });

  const presetIcons = PRESET_ICON_NAMES;

  useEffect(() => { if (initialData) reset(initialData); }, [initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: UpdateAmenityFormValues) => {
    updateMutation({ id: initialData.id, ...data }, { onSuccess: () => { onClose(); } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <FadeIn className="w-full max-w-md">
        <Div variant="bg_white" vitri="col_none" className="relative w-full !p-6 !rounded-2xl">
          <H variant="text_black" className="text-2xl font-bold">Cập nhật ti�!n ích</H>
          <P className="text-gray-500 mb-4">Ch�0nh sửa thông tin ti�!n ích</P>
          <Button className="absolute top-4 right-4 !p-2 !bg-gray-100 hover:!bg-gray-200 !rounded-full !min-h-0"
              onClick={() => onClose()}
          >
              <IoClose className="text-xl text-gray-600" />
          </Button>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Div grids="col_1" vitri='col_none' gap="g4_5" size="full">
              <Div vitri="col_none" size="full" >
                  <Label>Tên ti�!n ích <span className="text-red-500">*</span></Label>
                  <Input
                      sizea="full"
                      placeholder="VD: Wifi mi�&n phí"
                      {...register("name")}
                      className={`!rounded-xl ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && <P className="text-red-500 text-sm mt-1">{errors.name.message}</P>}
              </Div>
              
              <Div vitri="col_none" size="full" >
                  <Label>BiỒu tượng (Icon)</Label>
                  <Input
                      sizea="full"
                      placeholder="Nhập tên icon hoặc chọn bên dư�:i..."
                      {...register("icon")}
                      className="!rounded-xl"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {presetIcons.map((iconName, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setValue("icon", iconName, { shouldValidate: true })}
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-100 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 rounded-xl text-lg text-gray-600 transition-all shadow-sm"
                        title={iconName}
                      >
                        {AMENITY_ICONS[iconName]}
                      </button>
                    ))}
                  </div>
              </Div>

              <Div vitri="col_none" size="full" className="mt-2">
                  <Label>Mô tả</Label>
                  <textarea 
                      className={`w-full h-24 p-3 border rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none outline-none ${errors.description ? "border-red-500" : "border-gray-200"}`}
                      placeholder="Mô tả ti�!n ích..."
                      {...register("description")}
                  />
                  {errors.description && <P className="text-red-500 text-sm mt-1">{errors.description.message}</P>}
              </Div>
            </Div>
            
            <Div className="justify-end mt-6 pt-4 border-t border-gray-50" gap="g3_4" >
                <Button type="button" variant="red" sizea="p3_2" className="!rounded-xl" onClick={() => onClose()} disabled={isPending}>Hủy</Button>
                <Button type="submit" variant="green" sizea="p3_2" className="!rounded-xl" disabled={isPending}>
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <FiLoader className="animate-spin" /> Đang lưu...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <FiSave /> Lưu thay ��"i
                        </span>
                    )}
                </Button>
            </Div>
          </form>
        </Div>
      </FadeIn>
    </div>
  );
};
export default UpdateAmenityForm;
