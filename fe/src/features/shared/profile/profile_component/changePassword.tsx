"use client"
import { Div, H, P, Label, Input, Button } from "@/src/core/components/ui"
import { ChangePasswordSchemas, ChangePasswordForm } from "../profile_schemas/changePassword_schemas"
import { useChangePassword } from "../profile_hook/useChangPassword"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react"

const ChangePassword = () => {
    const [eye, setEye] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false
    })
    const { mutate: changePassword } = useChangePassword()
    const { user } = useAuthStore()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(ChangePasswordSchemas),
        defaultValues: {
            id: user?.id,
        }
    });

    const HandleClickEye = (name: "currentPassword" | "newPassword" | "confirmNewPassword") => {
        setEye(prev => ({
            ...prev,
            [name]: !prev[name]
        }))
    }
    const HandleOnsubmit = (data: ChangePasswordForm) => {
        alert("đã đến")
        changePassword(data)
    }
    return (
        <Div className="p-5 gap-3 flex-col" size="full" variant="bg_white">
            <H variant="text_black" className="text-2xl">Đổi mật khẩu</H>
            <form action="" className="w-100" onSubmit={handleSubmit(HandleOnsubmit)}>
                <Div className="gap-5 flex-col" size="full">
                    <Div vitri="col_none" className="gap-2  relative" size="full">
                        <Label htmlFor="currentPassword" variant="black">Mật khẩu hiện tại</Label>
                        <Input
                            type={eye.currentPassword ? "text" : "password"}
                            className="text-black pr-10" id="currentPassword"
                            placeholder="Nhập mật khẩu cũ"
                            sizea="full"
                            {...register("currentPassword")}
                        />
                        {errors.currentPassword && <P variant="mes" className="absolute -right-2 -bottom-8">{errors.currentPassword.message}</P>}
                        <Button className="absolute right-2 bottom-2  "
                            type="button"
                            onClick={() => HandleClickEye("currentPassword")}
                        >
                            {eye.currentPassword ? <FaRegEye className=" text-2xl  " /> : <FaRegEyeSlash className=" text-2xl" />}
                        </Button>
                    </Div>
                    <Div vitri="col_none" className="gap-2  relative" size="full">
                        <Label htmlFor="newPassword" variant="black">Mật khẩu mới</Label>
                        <Input
                            type={eye.newPassword ? "text" : "password"}
                            className="text-black pr-10" id="newPassword"
                            placeholder="Nhập mật khẩu mới"
                            sizea="full"
                            {...register("newPassword")}


                        />
                        {errors.newPassword && <P variant="mes" className="absolute -right-2 -bottom-8">{errors.newPassword.message}</P>}

                        <Button className="absolute right-2 bottom-2  "
                            type="button"
                            onClick={() => HandleClickEye("newPassword")}
                        >
                            {eye.newPassword ? <FaRegEye className=" text-2xl  " /> : <FaRegEyeSlash className=" text-2xl" />}
                        </Button>
                    </Div>
                    <Div vitri="col_none" className="gap-2  relative" size="full">
                        <Label htmlFor="confirmNewPassword" variant="black">Xác nhận mật khẩu mới</Label>
                        <Input
                            type={eye.confirmNewPassword ? "text" : "password"}
                            className="text-black pr-10" id="confirmNewPassword"
                            placeholder="Nhập lại mật khẩu mới"
                            sizea="full"
                            {...register("confirmNewPassword")}
                        />
                        {errors.confirmNewPassword && <P variant="mes" className="absolute -right-2 -bottom-8">{errors.confirmNewPassword.message}</P>}
                        <Button className="absolute right-2 bottom-2  "
                            type="button"
                            onClick={() => HandleClickEye("confirmNewPassword")}
                        >
                            {eye.confirmNewPassword ? <FaRegEye className=" text-2xl  " /> : <FaRegEyeSlash className=" text-2xl" />}
                        </Button>
                    </Div>


                </Div>
                <Div className=" justify-end mt-10 ">
                    <Button
                        type="submit"
                        variant="green" sizea="p3_2"
                    >
                        Lưu thay đổi
                    </Button>
                </Div>
            </form>
        </Div>
    )
}
export default ChangePassword