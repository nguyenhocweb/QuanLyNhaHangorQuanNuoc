import { BrandCardType } from "../types/brand-card-type";
import { Div, P, A } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
const Brand_Card_Components = ({ dataBrand, index }: { dataBrand: BrandCardType, index: number }) => {
    const Tag = `${dataBrand.name.split(" ")[0].split("")[0]}${dataBrand.name.split(" ")[1]?.split("")[0]} `
    const random = Math.floor(Math.random() * 9);
    const colors = [
        "bg-red-500",
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-orange-500",
        "bg-pink-500",
        "bg-black",
        "bg-gray-500",
    ];
    return (
        <FadeIn delay={(index + 1) / 10}>
            <Div className="flex-col w-70">
                <div className="overflow-hidden rounded-xl">
                    <img
                        src={`${dataBrand.imageMain}?auto=format&fit=crop&w=800&q=80`}
                        alt={dataBrand.name}
                        className="w-full h-48 object-cover hover:scale-105 transition duration-500"
                    />
                </div>
                <Div vitri="col_none" className=" p-2">
                    <Div size='full' className=" justify-between">
                        <Div gap="g3_4">
                            <Div size="w8_h8" shape="circle"
                                className={(!dataBrand.logo) ? `${colors[random]} text-white overflow-hidden` : " overflow-hidden"}

                            >
                                {
                                    dataBrand.logo ?
                                        <img
                                            src={`${dataBrand.logo}?auto=format&fit=crop&w=32&q=80`}
                                            alt={dataBrand.name}
                                            className=" object-cover hover:scale-105 transition duration-500 "
                                        />
                                        :
                                        Tag
                                }
                            </Div>
                            <h2 className=" line-clamp-1 w-35  font-semibold text-gray-900 text-lg">{dataBrand.name}</h2>
                        </Div>
                       {(!!dataBrand.numberRestaurant  )&& <P className="text-xs" variant="text_green">{dataBrand.numberRestaurant} cở sở</P>}
                    </Div>
                    {dataBrand.description && <P variant="truncate_2line" className="text-xs text-gray-500">{dataBrand.description}</P>}

                    <A href={`/brands/${dataBrand.id}`} colors="green">Xem chi tiết</A>
                </Div>
            </Div>
        </FadeIn>

    )
}
export default Brand_Card_Components