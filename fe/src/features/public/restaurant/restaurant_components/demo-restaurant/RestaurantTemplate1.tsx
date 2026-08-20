"use client"
import { Div, P, H } from "@/src/core/components/ui";
import OverviewPage from "./sidebarpage/overview";
import PolicyPage from "./sidebarpage/policy";
import SidebarPage from "./SidebarRestaurant";
import AmenityPage from "./sidebarpage/amenities";
import MenuPage from "./sidebarpage/menu";
import BusinessHoursPage from "./sidebarpage/Business_hours";
import IamgePage from "./sidebarpage/Images";
import CreateReservation_form from "@/src/features/customer/reservation/reservation_component/CreateReservation_form";
import { useRestaurandById } from "../../restaurant_hook/useRestaurantById_hook";
import Loading from "@/src/core/components/layout/public-loading"
import { isSameDay } from "@/src/core/lib/Opentime";
import FadeIn from "@/src/core/components/animation/FadeIn";

const RestaurantTemplate1 = ({ id }: { id: string }) => {
    const { data, isLoading, isFetched } = useRestaurandById(id);

    if (isLoading) return <Loading />
    const time = data?.timeWeek.find((e) => isSameDay(new Date(), new Date(e.date)));

    return (
        <Div vitri="col_none" size="full_screen" >
            <Div className=" overflow-hidden relative rounded-none " vitri="col_none" size="full">
                <Div variant="restaurant_template1_svg" size="full" />

                <Div variant="restaurant_template1" size="full_screen" className="rounded-none" >
                    {/* left content */}

                    <Div className="w-1/2 z-1" vitri="col_none" gap="g5_6">
                        <FadeIn delay={0.1}>
                            {data?.brandName && <H variant="text_FireIce" className="text-xl font-bold">{data.brandName}</H>}
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <H variant="text_FireIce" fonts="serif" className="text-5xl">
                                <span className="text-gray-600">Nhà hàng</span> &nbsp;  {data?.name}
                            </H>
                        </FadeIn>

                        {data?.description &&
                            <FadeIn delay={0.3}>
                                <P variant="text_black" className="text-lg">{data.description}</P>
                            </FadeIn>
                        }

                    </Div>
                    {/* right image */}
                    <FadeIn delay={0.1} >
                        <Div className="w-120 h-120 z-1 aspect-square rounded-full overflow-hidden border-2 border-white shadow-[0_0_50px] shadow-red-500/90">
                            <img
                                src={data?.imageMain}
                                alt="restaurant image"
                                className="w-full h-full object-cover shadow-2xl scale-110"
                            />
                        </Div>
                    </FadeIn>
                </Div>
            </Div>
            <Div size="full" className="px-20 my-3 items-start" gap="g3_4">
                {/* left thông tin nhà hàng */}
                <Div vitri="col_none" className="w-2/3 " gap="g5_6">
                    {data &&
                        <FadeIn delay={0.1} className="w-full">
                            <OverviewPage
                                name={data.name}
                                emailContact={data?.emailContact}
                                phoneContact={data?.phoneContact}
                                address={`${data.address}, ${data.city}`}
                                time={time && time.is_open ? `${time.open_time}-${time.close_time}` : undefined}
                            />
                        </FadeIn>
                    }

                    <SidebarPage />

                    <FadeIn delay={0.2} className="w-full">
                        <PolicyPage />
                    </FadeIn>
                    <FadeIn delay={0.2} className="w-full">
                        <MenuPage idRestaurant={id}/>
                    </FadeIn>
                    <FadeIn delay={0.2} className="w-full">
                        <AmenityPage />
                    </FadeIn>

                    <FadeIn delay={0.2} className="w-full">
                        <BusinessHoursPage data={data?.timeWeek || undefined} />
                    </FadeIn>
                    <FadeIn delay={0.2} className="w-full">
                        <IamgePage images={data ? [data.imageMain, ...data.images] : undefined} />
                    </FadeIn>

                </Div>

                <Div vitri="col_none" className="w-1/3  self-stretch " gap="g5_6" >
                    {data && <CreateReservation_form idRestaurant={data.id} />}
                </Div>
            </Div>

        </Div>
    );
};
export default RestaurantTemplate1;