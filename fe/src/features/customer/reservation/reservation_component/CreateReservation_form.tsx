"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateReservation } from "../reservation_hook/useCreateReservation_hook";
import { ReservationForm, ReservationShema } from "../reservation_schemas/createReservation_schemas";

import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { useRouter } from "next/navigation";

import { Div, H, Button, Input, Label, Select, P } from "@/src/core/components/ui"
import TableComponent from "@/src/features/staff/table/table_component/table_component";
const purposeOptions = [
    { value: "NORMAL", label: "Dùng bữa bình thường" },
    { value: "BIRTHDAY", label: "Sinh nhật" },
    { value: "ANNIVERSARY", label: "Kỷ niệm (ngày cưới, yêu nhau...)" },
    { value: "BUSINESS", label: "Tiếp khách/Công việc" },
    { value: "DATE", label: "Hẹn hò cặp đôi" },
    { value: "OTHER", label: "Khác" }
];
const CreateReservation_form = ({ idRestaurant }: { idRestaurant: string }) => {
    
    const User=useAuthStore((state)=>state.user);
    
    const router=useRouter();

     const [isSelectTable,setIsSelectTable]=useState(false);
     
    const { mutate: CreateReservationMutation, isPending } = useCreateReservation();
    const {
        register,
        reset,
        handleSubmit,
        getValues,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(ReservationShema),
        defaultValues: {
            autoTable: true,
            idRestaurant,
            userId: User?.id || "",
            guest_email: User?.email || "",
            guest_phone: User?.sdt || User?.phone || "",
            guest_name: User?.name || "",
            reservation_date: new Date().toISOString().split("T")[0],
            party_size: 1
        }
    })
   
    
    const Handlesubmit = (data: ReservationForm) => {
        if(!User) return router.push("/login");
        if (data.autoTable) {
            CreateReservationMutation(data)
        }else{
            setIsSelectTable(true)
        }
    }
    
    if(isSelectTable) return <TableComponent data1={watch() as ReservationForm} onclick={()=>{setIsSelectTable(false)}}/>
    
    return (
        <Div vitri="col_none" size='full' variant="bg_white" className="sticky top-16">
            <H variant="text_black" className="text-2xl font-bold mb-4">Đặt bàn & Chọn bàn</H>
            <form className="w-full" onSubmit={handleSubmit(Handlesubmit)}>
                <Div vitri="col_none" size="full" gap="g4_5" >

                    {/* nút tùy chọn  */}
                    <div className="flex items-center justify-end gap-3 w-full " >
                        <span className="text-gray-700">Tự động chọn bàn</span>
                        <button
                            type="button"
                            onClick={() => { setValue("autoTable",!watch("autoTable")) }}
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${watch("autoTable") ? "bg-green-600" : "bg-gray-300"}`}
                        >
                            <div
                                className={`bg-white w-4 h-4 rounded-full shadow transform transition ${watch("autoTable") ? "translate-x-6" : "translate-x-0"}`}
                            />
                        </button>

                    </div>

                    {/*  */}
                    <Div size="full" grids="col_2" className=" justify-between">

                        <Div vitri="col_none" className=" relative" >
                            <Label htmlFor="reservation_date" variant="black" >Chọn ngày đến</Label>
                            <Input id="reservation_date" className="text-black " type="date"
                                {...register("reservation_date")}
                            />
                            {errors.reservation_date && <P variant="mes" className=" absolute left-0 -bottom-6" line="truncate_1line" title={errors.reservation_date?.message}>{errors.reservation_date?.message}</P>}
                        </Div>
                        <Div className=" gap-x-3">
                            <Div vitri="col_none" className=" relative" >
                                <Label htmlFor="start_time" variant="black" >Chọn giờ đến</Label>
                                <Input id="start_time" className="text-black" type="time"
                                    {...register("start_time")}
                                />
                                {errors.start_time && <P variant="mes" className=" absolute left-0 -bottom-6" line="truncate_1line" title={errors.start_time?.message}>{errors.start_time?.message}</P>}

                            </Div>
                            <Div vitri="col_none" className=" relative">
                                <Label htmlFor="end_time" variant="black">Chọn giờ rời đi </Label>
                                <Input id="end_time" className="text-black " type="time"
                                    {...register("end_time")}
                                />
                                {errors.end_time && <P variant="mes" className=" absolute left-0 -bottom-6" line="truncate_1line" title={errors.end_time?.message}>{errors.end_time?.message}</P>}

                            </Div>
                        </Div>


                    </Div>
                    <Div size="full" grids="col_2" className="   justify-between ">
                        <Div vitri="col_none" className="w-1/2 relative" >
                            <Label htmlFor="party_size" variant="black" >Số khách </Label>
                            <Input id="party_size" className="text-black " type="number"
                                {...register("party_size")}
                            />
                            {errors.party_size && <P variant="mes" className=" absolute left-0 -bottom-6" line="truncate_1line" title={errors.party_size.message}>{errors.party_size?.message}</P>}
                        </Div>
                        <Div vitri="col_none" className=" relative"  >
                            <Label htmlFor="occasion" variant="black"
                            >Dịp </Label>
                            <Select id="occasion" defaultValue="NORMAL" className="text-black w-full"
                                {...register("occasion")}
                            >
                                {
                                    purposeOptions.map((e, index) =>
                                        <option key={index} value={e.value} className="text-black">{e.label}</option>
                                    )
                                }
                            </Select>
                            {errors.occasion && <P variant="mes" className=" absolute left-0 -bottom-6" line="truncate_1line" title={errors.occasion.message}>{errors.occasion?.message}</P>}

                        </Div>
                    </Div>

                    {/* thông tin khách hàng */}
                    <H variant="text_black">Thông tin khách</H>
                    <Div size="full" grids="col_2" className="  justify-between " gap="g4_5">

                        <Div vitri="col_none" className=" relative" >
                            <Label htmlFor="guest_name" variant="black">Họ và tên</Label>
                            <Input id="guest_name" className="text-black "
                                {...register("guest_name")}
                            />
                            {errors.guest_name && <P variant="mes" className=" absolute left-0 -bottom-6" line="truncate_1line" title={errors.guest_name.message}>{errors.guest_name?.message}</P>}

                        </Div>
                        <Div vitri="col_none" className=" relative">
                            <Label htmlFor="guest_phone" variant="black">Số điện thoại</Label>
                            <Input id="guest_phone" className="text-black "
                                {...register("guest_phone")}
                            />
                            {errors.guest_phone && <P variant="mes" className=" absolute left-0 -bottom-6" line="truncate_1line" title={errors.guest_phone.message}>{errors.guest_phone?.message}</P>}

                        </Div>
                        <Div vitri="col_none" className=" relative" >
                            <Label htmlFor="guest_email" variant="black">Email</Label>
                            <Input id="guest_email" className="text-black "
                                {...register("guest_email")}
                            />
                            {errors.guest_email && <P variant="mes" className=" absolute left-0 -bottom-6" line="truncate_1line" title={errors.guest_email.message}>{errors.guest_email?.message}</P>}

                        </Div>
                        <Div vitri="col_none" className=" relative">
                            <Label htmlFor="special_requests" variant="black">Yêu cầu thêm</Label>
                            <Input id="special_requests" className="text-black " placeholder="Ghi chú" 
                            {...register("special_requests")}
                            />
                                                          {errors.special_requests && <P variant="mes" className=" absolute left-0 -bottom-6" line="truncate_1line" title={errors.special_requests.message}>{errors.special_requests?.message}</P>}

                        </Div>

                    </Div>
                    <Div className={watch("autoTable")? " justify-center mt-5" : "justify-end mt-5"} size="full">
                        <Button variant="green" sizea="p4_2" type="submit" className={watch("autoTable")? "w-full" : ""}>{watch("autoTable")? " Đặt bàn" : "Tiếp"}</Button>
                    </Div>
                </Div>
            </form>
        </Div>

    )
}
export default CreateReservation_form