import React from "react";
import { UseFormReturn } from "react-hook-form";
import { UpsertOperatingHoursFormValues } from "../schema/operating_hours.upsert.schema";

interface Props {
    index: number;
    form: UseFormReturn<UpsertOperatingHoursFormValues>;
    dayName: string;
}

const OperatingHourRow: React.FC<Props> = ({ index, form, dayName }) => {
    const isClosed = form.watch(`operating_hours.${index}.is_closed`);

    return (
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl border transition-all ${isClosed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-indigo-200'}`}>
            {/* Day Name */}
            <div className="col-span-1 md:col-span-2 font-semibold text-gray-800">
                {dayName}
            </div>

            {/* Toggle Switch */}
            <div className="col-span-1 md:col-span-2 flex items-center md:justify-center">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer"
                        {...form.register(`operating_hours.${index}.is_closed`)}
                    />
                    <div className="w-11 h-6 bg-indigo-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-300"></div>
                    <span className={`ml-3 text-sm font-medium ${isClosed ? 'text-gray-500' : 'text-indigo-600'}`}>
                        {isClosed ? 'Đóng cửa' : 'Mở cửa'}
                    </span>
                </label>
            </div>

            {/* Operating Hours */}
            <div className="col-span-1 md:col-span-4 flex items-center justify-center gap-2">
                <input 
                    type="time" 
                    className="flex-1 max-w-[140px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    disabled={isClosed}
                    {...form.register(`operating_hours.${index}.open_time`)}
                />
                <span className="text-gray-400 font-medium">-</span>
                <input 
                    type="time" 
                    className="flex-1 max-w-[140px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    disabled={isClosed}
                    {...form.register(`operating_hours.${index}.close_time`)}
                />
            </div>

            {/* Break Time */}
            <div className="col-span-1 md:col-span-4 flex flex-col gap-1 items-center justify-center">
                <div className="flex items-center justify-center gap-2 w-full">
                    <input 
                        type="time" 
                        className="flex-1 max-w-[140px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        disabled={isClosed}
                        {...form.register(`operating_hours.${index}.break_start`)}
                    />
                    <span className="text-gray-400 font-medium">-</span>
                    <input 
                        type="time" 
                        className="flex-1 max-w-[140px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        disabled={isClosed}
                        {...form.register(`operating_hours.${index}.break_end`)}
                    />
                </div>
                {/* Error message handling */}
                {(form.formState.errors.operating_hours?.[index]?.open_time || form.formState.errors.operating_hours?.[index]?.break_start) && (
                    <div className="text-xs text-red-500 mt-1 w-full text-center">
                        {form.formState.errors.operating_hours[index]?.open_time?.message || form.formState.errors.operating_hours[index]?.break_start?.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OperatingHourRow;
