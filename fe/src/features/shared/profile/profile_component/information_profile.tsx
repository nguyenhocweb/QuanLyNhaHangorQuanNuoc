"use client"
import { Div, P, H, Label, Input, Select, Button } from "@/src/core/components/ui";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { InformationProfileForm, InformationProfileSchema } from "../profile_schemas/information_profile";
import { useUpdateProfile } from "../profile_hook/information_profile";
import {toast}  from "sonner"
const ImformationProfile = () => {
    const { user } = useAuthStore();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }

    } = useForm({
        resolver: zodResolver(InformationProfileSchema),
    });
    // Cập nhật dữ liệu khi user thay đổi
    useEffect(() => {
        if (user) {
            reset({
                id: user.id || "",
                name: user.name || "",
              
                date_of_birth: user?.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : "",
                gender: user.gender || ""
            });
        }
    }, [user, reset]);

    const { mutate: updateProfile } = useUpdateProfile();
    const onSubmit = (data: InformationProfileForm) => {
        // so sánh dữ liệu cũ và mới có gì khác nhau không
        const userDataOld = {
            id: user.id || "",
            name: user.name || "",
            date_of_birth: user?.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : "",
            gender: user.gender || ""
        }
        if(JSON.stringify(userDataOld)===JSON.stringify(data)) toast.success("Thông tin chưa được thay đổi")
            updateProfile(data);
    }


    return (
        <Div vitri="col_none" className="p-5 gap-3" size="full" variant="bg_white">
            <H variant="text_black" className="text-2xl">Thông tin cá nhân</H>
            <form action="" onSubmit={handleSubmit(onSubmit)} className=" w-full text-black">
                <Div grids="col_2" className="gap-5" size="full">
                    <Div vitri="col_none" className="gap-2  relative" size="full">
                        <Label htmlFor="name" variant="black">Họ và tên</Label>
                        <Input
                            type="text"
                            className="text-black" id="name"
                            placeholder="Nhập họ và tên"
                            sizea="full"
                            {...register("name")}
                        />
                        {errors.name && <P variant="mes" className="absolute -right-2 -bottom-8">{errors.name.message}</P>}
                    </Div>
                    <Div vitri="col_none" className="gap-2  relative" size="full">

                        <Label htmlFor="email" variant="black">Email</Label>
                        <Input
                            type="email" className="text-black pr-20" id="email" placeholder="Nhập email" sizea="full"
                             defaultValue={user?.email}
                             disabled
                        />

                        <Button variant="text_green" className=" absolute right-2 bottom-2">Thay đổi</Button>
                    </Div>
                    <Div vitri="col_none" className="gap-2  relative" size="full">
                        <Label htmlFor="phone" variant="black">Số điện thoại</Label>
                        <Input type="text" className="text-black pr-20" id="phone" placeholder="Nhập số điện thoại" sizea="full" 
                        defaultValue={user?.sdt}
                        disabled
                        />
                        <Button variant="text_green" className=" absolute  right-2 bottom-2">Thay đổi</Button>
                    </Div>
                    <Div vitri="col_none" className="gap-2  relative" size="full">
                        <Label htmlFor="dob" variant="black">Ngày sinh</Label>
                        <Input type="date" className="text-black" id="dob" sizea="full" {...register("date_of_birth")} />
                        {errors.date_of_birth && <P variant="mes" className="absolute -right-2 -bottom-8">{errors.date_of_birth.message}</P>}
                    </Div>
                    <Div vitri="col_none" className="gap-2  relative" size="full">
                        <Label htmlFor="gender" variant="black">Giới tính</Label>
                        <Select id="gender" className="text-black" sizea="full" {...register("gender")}>
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nu">Nữ</option>
                            <option value="Khac">Khác</option>
                        </Select>
                        {errors.gender && <P variant="mes" className="absolute -right-2 -bottom-8">{errors.gender.message}</P>}

                    </Div>

                </Div>
                <Div className=" justify-end mt-10 px-10">
                    <Button
                        type="submit"
                        variant="green" sizea="p3_2"
                    >
                        Lưu thông tin
                    </Button>
                </Div>

            </form>
        </Div>
    )
}
export default ImformationProfile