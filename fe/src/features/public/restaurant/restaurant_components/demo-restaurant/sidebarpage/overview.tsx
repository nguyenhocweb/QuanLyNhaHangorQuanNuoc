
import { Div, H, P } from "@/src/core/components/ui";
import { MdOutlineMail } from "react-icons/md";
import { FaHeadphonesSimple } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";

type OverviewType = {
    name: string,
    address: string,
    phone_contact?: string,
    email_contact?: string,
    time?: string
}
const OverviewPage = ({ name,address,phone_contact,email_contact,time }: OverviewType) => {
    return (
        <Div vitri="col_none" variant="bg_white" size="full">
            <H variant="text_black" className="text-2xl font-bold mb-4">{name}</H>
            <Div vitri='col_none'>

                <Div>
                    <H variant="text_green" className="text-lg font-semibold ">
                        <IoLocationOutline className="text-2xl" />
                    </H>
                    <P variant="text_black" >{address}</P>
                </Div>
                {phone_contact &&
                    <Div>
                        <H variant="text_green" className="text-lg font-semibold ">
                            <FaHeadphonesSimple className="text-2xl" />
                        </H>
                        <P variant="text_black" >{phone_contact}</P>
                    </Div>
                }
                {email_contact &&
                    <Div>
                        <H variant="text_green" className="text-lg font-semibold ">
                            <MdOutlineMail className="text-2xl" />
                        </H>
                        <P variant="text_black" className="mb-4">{email_contact}</P>
                    </Div>
                }
                <Div className="md:col-span-2">
                    <H variant="text_green" className="text-lg font-semibold ">
                        <IoMdTime className="text-2xl" />

                    </H>
                    <P variant="text_green" >{time?`đang mở ${time}`:"đang đóng của"}</P>
                </Div>

            </Div>
        </Div>
    )
}
export default OverviewPage;