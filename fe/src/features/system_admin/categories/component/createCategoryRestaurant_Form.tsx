import { Div, H, P, Label, Input, Button } from "@/src/core/components/ui"
import { IoClose } from "react-icons/io5"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema, CreateCategoryFormValues } from "../schema/createCategory-schema";
import { useCreateCategoryRestaurant } from "../hook/useCreateCategoryRestaurant_hook";
import { FiLoader, FiLayers, FiZap, FiRefreshCw } from "react-icons/fi";
import { useRandomColor } from "@/src/core/hooks/useRandomColor";

const CreateCategoryRestaurant = ({ onclickClose }: { onclickClose: () => void }) => {
    const { mutate, isPending } = useCreateCategoryRestaurant(onclickClose);
    const { getLighterColor, getDarkerColor, getRandomColorPair } = useRandomColor();
    
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<CreateCategoryFormValues>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: "",
            description: "",
            bgColor: "#EEF2FF",
            textColor: "#6366F1"
        }
    });

    const onSubmit = (data: CreateCategoryFormValues) => {
        mutate(data);
    };

    // Theo dõi giá trị color để update preview
    const bgColor = watch("bgColor") || "#EEF2FF";
    const textColor = watch("textColor") || "#6366F1";
    const name = watch("name") || "Tên loại hình mẫu";

    return (
        <Div variant="bg_white" vitri="col_none" className=" relative w-100" style={{'--bg-color': bgColor, '--text-color': textColor} as React.CSSProperties}>
            <H variant="text_black" className="text-2xl">Thêm loại nhà hàng mới</H>
            <P>Thêm một loại hình nhà hàng mới</P>
            <Button className=" absolute top-2 right-2"
                onClick={() => onclickClose()}
            >
                <IoClose className="text-2xl" />
            </Button>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <Div grids="col_1" vitri='col_none' gap="g4_5" size="full" className="mt-5">
                    <Div vitri="col_none" size="full" >
                        <Label>Tên loại hình nhà hàng <span className="text-red-500">*</span></Label>
                        <Input
                            sizea="full"
                            placeholder="Nhập tên loại hình"
                            {...register("name")}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <P className="text-red-500 text-sm mt-1">{errors.name.message}</P>}
                    </Div>
                    <Div vitri="col_none" size="full" className="gap-2">
                        <Div vitri="row_between" size="full">
                            <Label className="mb-0">Màu sắc (Colors)</Label>
                            <button 
                                type="button" 
                                onClick={() => {
                                    const { textColor, bgColor } = getRandomColorPair();
                                    setValue("textColor", textColor);
                                    setValue("bgColor", bgColor);
                                }} 
                                className="text-xs text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-1.5 font-medium transition-colors px-2.5 py-1.5 rounded-md"
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
                                    className="h-[40px] p-1 cursor-pointer"
                                    {...register("bgColor")}
                                    defaultValue="#EEF2FF"
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
                                    className="h-[40px] p-1 cursor-pointer"
                                    {...register("textColor")}
                                    defaultValue="#6366F1"
                                />
                            </Div>
                        </Div>
                    </Div>
                    <Div vitri="col_none" size="full">
                        <Label>Màu sắc Preview</Label>
                        <div className="flex items-center gap-3 mt-2">
                            <Div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-gray-100" 
                                style={{ 
                                    backgroundColor: errors.bgColor ? '#EEF2FF' : 'var(--bg-color, #EEF2FF)', 
                                    color: errors.textColor ? '#6366F1' : 'var(--text-color, #6366F1)' 
                                }}>
                                <FiLayers className="text-xl" />
                            </Div>
                            <span 
                                className="font-semibold text-[14px] px-4 py-2 rounded-lg whitespace-nowrap shadow-sm border border-gray-100"
                                style={{ 
                                    backgroundColor: errors.bgColor ? '#EEF2FF' : 'var(--bg-color, #EEF2FF)', 
                                    color: errors.textColor ? '#6366F1' : 'var(--text-color, #6366F1)' 
                                }}
                            >
                                {name}
                            </span>
                        </div>
                    </Div>
                    <Div vitri="col_none" size="full">
                        <Label>Mô tả</Label>
                        <textarea 
                            className={`w-full h-30 p-3 border rounded-lg resize-none ${errors.description ? "border-red-500" : "border-gray-200"}`}
                            placeholder="Mô tả loại hình nhà hàng"
                            {...register("description")}
                        />
                        {errors.description && <P className="text-red-500 text-sm mt-1">{errors.description.message}</P>}
                    </Div>
                </Div>
                <Div className=" justify-end mt-5" gap="g3_4" >
                    <Button type="button" variant="red" sizea="p3_2" onClick={() => onclickClose()} disabled={isPending}>Hủy</Button>
                    <Button type="submit" variant="green" sizea="p3_2" disabled={isPending}>
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <FiLoader className="animate-spin" /> Đang thêm...
                            </span>
                        ) : "Thêm"}
                    </Button>
                </Div>
            </form>
        </Div>
    )
}
export default CreateCategoryRestaurant