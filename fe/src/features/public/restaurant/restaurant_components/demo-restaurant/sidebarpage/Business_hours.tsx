
import { Div, H, P } from "@/src/core/components/ui";
import { DailySchedule } from "../../../restaurant_type/restaurantById_type";
const BusinessHoursPage = ({ data }: { data: DailySchedule[] | undefined }) => {
    const week = ["Chủ nhật", "Thứ 2", "Thứ 3", "thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]
    return (

        <Div id="business_hours" vitri="col_none" variant="bg_white" size="full">

            <H variant="text_black" className="text-2xl font-bold mb-4">Giờ hoạt động</H>
            { }
            {
                data ?


                    data.map((e, index) => (
                        <Div key={index} vitri='col_none' size="full"  >
                            <Div
                                size="full"
                            >
                                <H variant="text_black" className="w-1/2">
                                    {week[e.day_name]}
                                </H>
                                <P variant="text_black" className=" font-medium text-md w-1/2">
                                    {e.is_open ? `${e.open_time} - ${e.close_time}` : "đóng cửa"}
                                </P>
                            </Div>
                        </Div>
                    ))


                    :
                    <P>Đang cập nhật</P>
            }
        </Div>
    )
}
export default BusinessHoursPage