"use client"
import { Div, P, A } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useRestaurandCard } from "@/src/features/public/restaurant/restaurant_hook/useRestaurantCard_hook";
import Card_Restaurant_Component from "./card-restaurant-component";
import Loading from "@/src/core/components/layout/public-loading";
import { usePagination } from "@/src/core/hooks/usePagination";
import Pagination from "@/src/core/components/layout/Pagination";
const Featured_Restaurant_Component = ({ type, id, limit }: { type: "home" | "page", id?: string, limit?: number }) => {
    const limits = limit ?? (type === "page" ? 10 : 5);
    const { pageRestaurant, city, searchKeyword,setPageRestaurant,categoryRestaurant,review} = usePagination()
    const { data, isLoading, isFetched } = useRestaurandCard({
         page: pageRestaurant || 1, 
         limit: limits, 
         city: city ?? undefined,
          search: searchKeyword ?? undefined,
           id: id,
            categoryRestaurant: categoryRestaurant??[],
             review: review??undefined 
            });
    console.log(data);
    if (isLoading) return <Loading />
    return (
        <Div id="restaurant" vitri="col_none" size="full" >
            {type === "home" &&
                <Div className="justify-between mb-8 " size="full" >
                    <div>
                        <FadeIn>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Hệ thống Nhà hàng nổi bật
                            </h1>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <P>
                                Khám phá các điểm đến ẩm thực cụ thể thuộc hệ thống NVNguyen.
                            </P>
                        </FadeIn>
                    </div>
                </Div>
            }
            <Div gap="g2_3" variant="card">
                {data &&
                    data?.data.map((e, index) => (
                        <Card_Restaurant_Component key={e.id} dataRestaurant={e} index={index} />
                    ))
                }
            </Div>
            {type === "home" && !!data?.total &&
                <Div size="full" className="mt-3">
                    <FadeIn delay={0.6}>
                        <A href="/restaurants" sizea="p4_3" variant="gray">
                            Xem toàn bộ {(data?.total ?? 0) > 99 ? "99+" : (data?.total ?? 0)} nhà hàng
                        </A>
                    </FadeIn>
                </Div>
            }
            {type === "page" && !!data?.total && data?.total > limits &&
                <Div className="mt-10 justify-between px-10" size="full">
                    <P variant="text_black">Hiện có {data.total} nhà hàng</P>
                    <Pagination
                        totalPages={Math.ceil((data?.total ? data.total / limits : 0))}
                        currentPage={pageRestaurant??1}
                        limit={limits}
                        onPageChange={setPageRestaurant}
                    />
                </Div>
            }

        </Div >
    )
}
export default Featured_Restaurant_Component