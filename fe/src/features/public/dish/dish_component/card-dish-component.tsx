import { Card_Dish_Type } from "../dish_type/card_dish_type";
import { Div, P, A } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
const Card_Dish_Components = ({ dataDish, index }: { dataDish: Card_Dish_Type, index: number }) => {
    return (
        <FadeIn delay={(index + 1) / 10} >
            
                <Div className="flex-col w-70">
                    <div className="overflow-hidden rounded-xl relative">
                        <img
                            src={`${dataDish.image}?auto=format&fit=crop&w=800&q=80`}
                            alt={dataDish.name}
                            className="w-full h-48 object-cover hover:scale-105 transition duration-500"
                        />
                        {dataDish.is_featured && <P className="absolute top-2 right-1 bg-white text-xs text-red-500 font-bold flex items-center gap-1 rounded-md" >hot</P>}
                    </div>
                    <Div vitri="col_none" className=" p-2">
                        <Div gap="g3_4">

                            <h2 className=" line-clamp-1 w-40  font-semibold text-gray-900 text-lg">{dataDish.name}</h2>
                            <P variant="text_black">  {new Intl.NumberFormat('vi-VN').format(dataDish.base_price)}đ</P>
                        </Div>
                        <P variant="text_green" className="text-xs">{dataDish.restaurantName ?? dataDish.brandName}</P>
                        {dataDish.description && <P variant="truncate_2line" className="text-xs text-gray-500">{dataDish.description}</P>}

                        <A href={`/dishes/${dataDish.id}`} sizea="p4_2" variant="black" className="w-full">
                            Xem chi tiết
                        </A>
                    </Div>
                </Div>
            
        </FadeIn>

    )
}
export default Card_Dish_Components