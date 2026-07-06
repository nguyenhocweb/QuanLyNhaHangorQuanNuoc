import { Div, P, A } from "@/src/core/components/ui";
import { RestaurantCardType } from "@/src/features/public/restaurant/restaurant_type/restaurant_card_type";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { FaStar } from "react-icons/fa";
const formatAddress = (address: any) => {
    if (typeof address === 'string') return address;
    if (typeof address === 'object' && address !== null) {
        return [address.street, address.ward, address.district, address.province].filter(Boolean).join(', ');
    }
    return '';
};

const Card_Restaurant_Component = ({ dataRestaurant, index }: { dataRestaurant: RestaurantCardType, index: number }) => {
    return (
        <FadeIn delay={(index + 1) / 10}>
            <Div className="flex-col w-70">
                <div className="overflow-hidden rounded-xl relative">
                    <img
                        src={`${dataRestaurant.imageMain}?auto=format&fit=crop&w=800&q=80`}
                        alt={dataRestaurant.name}
                        className="w-full h-48 object-cover hover:scale-105 transition duration-500"
                    />
                    { dataRestaurant.isNew?
                    <P className="absolute top-2 right-1 bg-white text-xs text-red-500 font-bold flex items-center gap-1 rounded-md" >New</P>
                    :
                    <P className=" absolute top-2 right-1 bg-white text-xs flex items-center gap-1 rounded-md" >
                        {dataRestaurant.averageRating} <FaStar className="text-yellow-500"/>
                    </P>
                    } 
                </div>
                <Div vitri="col_none" className="p-2" size="full">

                    <p className="text-xs text-green-600 font-semibold tracking-wide">{dataRestaurant.brandName}</p>
                    <h2 className=" line-clamp-1 w-40 font-semibold text-gray-900 text-lg">{dataRestaurant.name}</h2>
                    <P className="flex gap-1 text-xs text-gray-500 ">
                        <FaLocationDot />   <span className="line-clamp-1">{formatAddress(dataRestaurant.address)}</span>  </P>
                    <P className="text-xs flex gap-1">
                        <MdOutlineAccessTimeFilled />
                        {dataRestaurant.time}
                    </P>
                    <Div className=" justify-between py-3" size="full">
                        <A href={`/restaurants/${dataRestaurant.id}`} colors="green" className="text-xs">Xem chi tiết</A>
                        <A href="#" variant="black" className="text-xs" sizea="p4_2">Đặt bàn ngay</A>
                    </Div>
                </Div>
            </Div>
        </FadeIn>
    )
}
export default Card_Restaurant_Component