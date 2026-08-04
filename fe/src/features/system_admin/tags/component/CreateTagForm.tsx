"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTagSchema, CreateTagFormValues } from "../schema/tag-schema";
import { useCreateTag } from "../hook/useTag_hook";
import { Div, H, P, Label, Input, Button } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { IoClose } from "react-icons/io5";
import { FiLoader, FiTag, FiZap, FiRefreshCw } from "react-icons/fi";
import { useRandomColor } from "@/src/core/hooks/useRandomColor";

interface Props { isOpen: boolean; onClose: () => void; }

const CreateTagForm: React.FC<Props> = ({ isOpen, onClose }) => {
  const { mutate: createMutation, isPending } = useCreateTag();
  const { getLighterColor, getDarkerColor, getRandomColorPair } = useRandomColor();
  
  const [isSlugManual, setIsSlugManual] = React.useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<CreateTagFormValues>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      bgColor: "#EEF2FF",
      textColor: "#6366F1"
    }
  });

  const name = watch("name");

  React.useEffect(() => {
    if (!isSlugManual && name) {
      const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [name, isSlugManual, setValue]);

  if (!isOpen) return null;

  const onSubmit = (data: CreateTagFormValues) => {
    createMutation(data, {
      onSuccess: () => { 
        reset(); 
        setIsSlugManual(false);
        onClose(); 
      }
    });
  };

  const bgColor = watch("bgColor") || "#EEF2FF";
  const textColor = watch("textColor") || "#6366F1";
  const displayPreviewName = name || "Tên thẻ mẫu";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <FadeIn className="w-full max-w-md">
        <Div variant="bg_white" vitri="col_none" className="relative w-full !p-6 !rounded-2xl" style={{'--bg-color': bgColor, '--text-color': textColor} as React.CSSProperties}>
          <H variant="text_black" className="text-2xl font-bold">Thêm thẻ mới</H>
          <P className="text-gray-500 mb-4">Tạo một thẻ phân loại mới cho hệ thống</P>
          <Button className="absolute top-4 right-4 !p-2 !bg-gray-100 hover:!bg-gray-200 !rounded-full !min-h-0"
              onClick={() => onClose()}
          >
              <IoClose className="text-xl text-gray-600" />
          </Button>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Div grids="col_1" vitri='col_none' gap="g4_5" size="full">
              <Div vitri="col_none" size="full" >
                  <Label>Tên thẻ (Tag) <span className="text-red-500">*</span></Label>
                  <Input
                      sizea="full"
                      placeholder="Nhập tên thẻ"
                      {...register("name")}
                      className={`!rounded-xl ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && <P className="text-red-500 text-sm mt-1">{errors.name.message}</P>}
              </Div>
              
              <Div vitri="col_none" size="full" >
                  <Label>Đường dẫn tĩnh (Slug) <span className="text-red-500">*</span></Label>
                  <Input
                      sizea="full"
                      placeholder="VD: sang-trong"
                      {...register("slug", {
                        onChange: () => setIsSlugManual(true)
                      })}
                      className={`!rounded-xl ${errors.slug ? "border-red-500" : ""}`}
                  />
                  {errors.slug && <P className="text-red-500 text-sm mt-1">{errors.slug.message}</P>}
              </Div>

              <Div vitri="col_none" size="full" className="gap-2 mt-2">
                  <Div vitri="row_between" size="full">
                      <Label className="mb-0">Màu sắc (Colors)</Label>
                      <button 
                          type="button" 
                          onClick={() => {
                              const { textColor, bgColor } = getRandomColorPair();
                              setValue("textColor", textColor);
                              setValue("bgColor", bgColor);
                          }} 
                          className="text-xs text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-1.5 font-medium transition-colors px-2.5 py-1.5 rounded-lg"
                          title="Tạo ngẫu nhiên một cặp màu hài hòa"
                      >
                          <FiRefreshCw /> Random cặp màu
                      </button>
                  </Div>
                  <Div vitri="row_between" size="full" className="gap-4">
                      <Div vitri="col_none" className="w-1/2">
                          <Div vitri="row_between" size="full" className="mb-1">
                              <Label className="mb-0 text-sm font-normal text-gray-600">Màu nền</Label>
                              <button 
                                  type="button" 
                                  onClick={() => setValue("bgColor", getLighterColor(textColor))} 
                                  className="text-[11px] text-indigo-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                                  title="Tự động tạo màu nền nhạt từ màu chữ"
                              >
                                  <FiZap /> Auto
                              </button>
                          </Div>
                          <Input
                              type="color"
                              sizea="full"
                              className="h-[40px] p-1 cursor-pointer !rounded-xl"
                              {...register("bgColor")}
                          />
                      </Div>
                      <Div vitri="col_none" className="w-1/2">
                          <Div vitri="row_between" size="full" className="mb-1">
                              <Label className="mb-0 text-sm font-normal text-gray-600">Màu chữ</Label>
                              <button 
                                  type="button" 
                                  onClick={() => setValue("textColor", getDarkerColor(bgColor))} 
                                  className="text-[11px] text-indigo-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                                  title="Tự động tạo màu chữ đậm từ màu nền"
                              >
                                  <FiZap /> Auto
                              </button>
                          </Div>
                          <Input
                              type="color"
                              sizea="full"
                              className="h-[40px] p-1 cursor-pointer !rounded-xl"
                              {...register("textColor")}
                          />
                      </Div>
                  </Div>
              </Div>

              <Div vitri="col_none" size="full" className="mt-2">
                  <Label>Màu sắc Preview</Label>
                  <div className="flex items-center gap-3 mt-2">
                      <Div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-gray-100" 
                          style={{ 
                              backgroundColor: errors.bgColor ? '#EEF2FF' : 'var(--bg-color, #EEF2FF)', 
                              color: errors.textColor ? '#6366F1' : 'var(--text-color, #6366F1)' 
                          }}>
                          <FiTag className="text-xl" />
                      </Div>
                      <span 
                          className="font-semibold text-[14px] px-4 py-2 rounded-full whitespace-nowrap shadow-sm border border-gray-100"
                          style={{ 
                              backgroundColor: errors.bgColor ? '#EEF2FF' : 'var(--bg-color, #EEF2FF)', 
                              color: errors.textColor ? '#6366F1' : 'var(--text-color, #6366F1)' 
                          }}
                      >
                          {displayPreviewName}
                      </span>
                  </div>
              </Div>

              <Div vitri="col_none" size="full" className="mt-2">
                  <Label>Mô tả</Label>
                  <textarea 
                      className={`w-full h-24 p-3 border rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none outline-none ${errors.description ? "border-red-500" : "border-gray-200"}`}
                      placeholder="Mô tả thẻ..."
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
                            <FiLoader className="animate-spin" /> Đang thêm...
                        </span>
                    ) : "Thêm"}
                </Button>
            </Div>
          </form>
        </Div>
      </FadeIn>
    </div>
  );
};
export default CreateTagForm;
