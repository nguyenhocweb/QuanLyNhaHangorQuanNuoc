import { z} from "zod"
import {validator} from "@/src/core/lib/validations";

const today=new Date()
export const ReservationShema=z.object({
    idRestaurant:validator.string("id nhà hàng"),
    userId:validator.string("người khách"),
    autoTable:validator.boolean("tự động tạo table"), 
    reservation_date:validator.date("ngày đến",{minDate:today}),
    start_time:validator.string("giờ đến"),
    end_time:validator.string("giờ rời đi",255,0).nullish(),
    party_size:validator.number("số khách",1,100),
    occasion:validator.enum("dịp",["NORMAL","BIRTHDAY","ANNIVERSARY","BUSINESS","DATE","OTHER"]),
    guest_name:validator.string("Họ và tên"),
    guest_phone:validator.phone(),
    guest_email:validator.email().nullish(),
    special_requests:validator.string("yêu cầu thêm",255,0).nullish(),
    tables:validator.array("table",validator.string("id table")).nullish(),
})
export type ReservationForm=z.Infer<typeof ReservationShema>;