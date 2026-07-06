"use client"
import { Div, P, A } from "@/src/core/components/ui"
import PublicItemImages from "@/src/core/components/layout/public-item-image";


import { use } from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { useBrand_hook } from "@/src/features/system_admin/brands/brands_hook/useBrand_hook";
import FeaturedDishComponent from "@/src/features/public/dish/dish_component/featured-dish-component";
import Loading from "@/src/core/components/layout/public-loading";
import Featured_Restaurant_Component from "@/src/features/public/restaurant/restaurant_components/demo-card-restaurant/featured-restaurant-component";
const BrandItem = (
    { params }: {
        params: Promise<{ idBrand: string }>
    }) => {
    const { idBrand } = use(params);
    const { data, isLoading, isFetched } = useBrand_hook(idBrand);
    if (isLoading) return <Loading />
    if (isFetched && !data) {
        return <Div size="full">Không tìm thấy thương hiệu này!</Div>;
    }

    return (
        <Div vitri="col_none" className=" gap-y-40" >
            {data && (
                <PublicItemImages name={data?.name} isFeatured={data?.isFeatured} images={data?.images} />
            )}
            <Div vitri="col_none" size="full" className="mt-20 px-10">
                <P variant='text_green'>về {data?.name} </P>
                <Div size="full" gap="g5_6" className=" justify-start items-start ">
                    <Div className="w-6/10 p-2" vitri="col_none" >
                        <P className="text-2xl">{data?.description}</P>
                    </Div>
                    <Div vitri="col_none" className="w-3/10 bg-gray-100 p-3 rounded-none">
                        {data?.email_contact &&
                            <P variant="text_green" className="gap-x-4"><MdOutlineMail className="text-2xl" /> <span className="text-gray-500">{data?.email_contact}</span></P>
                        }
                        {data?.phone_contact &&
                            <P variant="text_green" className="gap-x-4"><FaPhoneAlt className="text-xl" /> <span className="text-gray-500">{data?.phone_contact}</span></P>
                        }
                        {data?.link &&
                            <A href={data?.link} className="text-green-600 flex gap-x-4 p-2"><TbWorld className="text-xl" /> <span className="text-gray-500">{data?.name}</span> </A>
                        }
                    </Div>
                </Div>
            </Div>
            <Div  className="px-10 gap-y-40" vitri="col_none" size="full" >
                <FeaturedDishComponent type="isBrand" id={idBrand} limit={5}/>
                <Featured_Restaurant_Component type="page" id={idBrand} limit={5} />
            </Div>
              
        </Div>
    )
}
export default BrandItem