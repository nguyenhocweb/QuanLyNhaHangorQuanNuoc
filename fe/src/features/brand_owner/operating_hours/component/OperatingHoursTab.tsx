"use client";
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertOperatingHoursSchema, UpsertOperatingHoursFormValues } from "../schema/operating_hours.upsert.schema";
import { useGetOperatingHours } from "../hook/useGetOperatingHours";
import { useUpsertOperatingHours } from "../hook/useUpsertOperatingHours";
import { Div, H, P, Button } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FiClock, FiSave } from "react-icons/fi";
import OperatingHourRow from "@/src/features/brand_owner/operating_hours/component/OperatingHourRow";

const DAYS_OF_WEEK = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

interface Props {
    id_brand: string;
    idRestaurant: string;
}

const defaultValues: UpsertOperatingHoursFormValues = {
    operating_hours: Array.from({ length: 7 }).map((_, i) => ({
        day_of_week: i,
        is_closed: false,
        open_time: "08:00",
        close_time: "22:00",
        break_start: null,
        break_end: null
    }))
};

const OperatingHoursTab: React.FC<Props> = ({ id_brand, idRestaurant }) => {
    const { data, isLoading } = useGetOperatingHours(id_brand, idRestaurant);
    const { mutate: upsert, isPending } = useUpsertOperatingHours(id_brand, idRestaurant);

    const form = useForm<UpsertOperatingHoursFormValues>({
        resolver: zodResolver(upsertOperatingHoursSchema) as any,
        defaultValues,
        mode: "onChange"
    });

    const { fields } = useFieldArray({
        control: form.control,
        name: "operating_hours"
    });

    useEffect(() => {
        if (data?.metadata && data.metadata.length === 7) {
            form.reset({
                operating_hours: [...data.metadata].sort((a: any, b: any) => a.day_of_week - b.day_of_week).map((item: any) => ({
                    day_of_week: item.day_of_week,
                    is_closed: item.is_closed,
                    open_time: item.open_time || null,
                    close_time: item.close_time || null,
                    break_start: item.break_start || null,
                    break_end: item.break_end || null
                }))
            });
        }
    }, [data, form]);

    const onSubmit = (values: UpsertOperatingHoursFormValues) => {
        upsert(values);
    };

    if (isLoading) {
        return (
            <Div className="p-10 justify-center items-center w-full">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </Div>
        );
    }

    return (
        <FadeIn className="w-full">
            <Div vitri="col_none" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100" size="full">
                <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <div>
                        <H className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FiClock className="text-indigo-600" />
                            Thời gian hoạt động
                        </H>
                        <P className="text-sm text-gray-500 mt-1">
                            Thiết lập giờ mở cửa, đóng cửa và giờ nghỉ trưa cho từng ngày trong tuần.
                        </P>
                    </div>
                    <Button 
                        variant="default" 
                        onClick={() => form.handleSubmit(onSubmit)()}
                        disabled={isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                    >
                        {isPending ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <FiSave />
                        )}
                        Lưu thay đổi
                    </Button>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    {/* Header Row */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-xl text-sm font-semibold text-gray-600">
                        <div className="col-span-2">Ngày</div>
                        <div className="col-span-2 text-center">Trạng thái</div>
                        <div className="col-span-4 text-center">Giờ hoạt động</div>
                        <div className="col-span-4 text-center">Giờ nghỉ (Tùy chọn)</div>
                    </div>

                    {/* Data Rows */}
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3, 4, 5, 6, 0].map((displayIndex) => {
                            const field = fields[displayIndex];
                            if (!field) return null;
                            return (
                                <OperatingHourRow 
                                    key={field.id} 
                                    index={displayIndex} 
                                    form={form} 
                                    dayName={DAYS_OF_WEEK[form.getValues(`operating_hours.${displayIndex}.day_of_week`)]}
                                />
                            );
                        })}
                    </div>
                </div>
            </Div>
        </FadeIn>
    );
};

export default OperatingHoursTab;
