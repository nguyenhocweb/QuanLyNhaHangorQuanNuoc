"use client"
import Card_Dish_Components from "./card-dish-component";
import Card_Brand_Dish_Components from "./card-brand-dish-component";
import { Div, P, A } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useDishCard_hook } from "../dish_hook/useDishCard_hook";
import Loading from "@/src/core/components/layout/public-loading";
import { usePagination } from "@/src/core/hooks/usePagination";
import Pagination from "@/src/core/components/layout/Pagination";


const FeaturedDishComponent = ({ type, id, limit, grid }: { type: "home" | "isBrand" | "isRestaurant", id?: string, limit?: number, grid?: number }) => {
    const { MenuItemPage, searchKeyword, setMenuItemPage } = usePagination();
    const limits = limit ?? (type === "home" ? 5 : 10); // nếu là trang home thì chỉ lấy 5 món ăn, còn nếu là trang brand hay restaurant thì lấy 10 món ăn
    const { data, isLoading } = useDishCard_hook({ type, limit: limits, page: MenuItemPage, search: searchKeyword ?? undefined, id: id || undefined });
    const dishList = data?.data ?? [];
    if (isLoading) return <Loading />
    return (
        <Div vitri="col_none" size="full" >
            <Div className={` mb-8 ${type === "home" ? "justify-between" : "justify-start"}`} size="full" >
                <Div vitri="col_none" className="w-1/2">
                    <FadeIn>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 ">
                            {type === "home" ? "Những món ăn được yêu thích nhất" : type === "isBrand" ? "Những món ăn mới nhất của thương hiệu" : ""}
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <P>
                            {
                                type === "home" ? "Khám phá những món ăn được yêu thích nhất trên nền tảng của chúng tôi. Từ các món ăn truyền thống đến những sáng tạo độc đáo, chúng tôi mang đến cho bạn một trải nghiệm ẩm thực đa dạng và hấp dẫn. Hãy thưởng thức những món ăn ngon nhất được đánh giá cao bởi cộng đồng người dùng của chúng tôi."
                                    : type === "isBrand" ? "Khám phá những món ăn mới nhất từ thương hiệu của chúng tôi. Chúng tôi liên tục cập nhật và giới thiệu những món ăn độc đáo và hấp dẫn, mang đến cho bạn trải nghiệm ẩm thực đa dạng và phong phú. Hãy thưởng thức những món ăn mới nhất được tạo ra bởi thương hiệu của chúng tôi."

                                        : null
                            }
                        </P>
                    </FadeIn>
                </Div>

            </Div>
            <Div gap="g2_3" variant="card" className={grid ? "lg:grid-cols-3" : ""} >
                {dishList &&
                    dishList.map((e, index) => (
                        type === "home" ? <Card_Dish_Components key={e.id} dataDish={e} index={index} />
                            :
                            type === "isBrand" ? <Card_Brand_Dish_Components key={e.id} dataDish={e} index={index} />
                                :
                                <Card_Dish_Components key={e.id} dataDish={e} index={index} />
                    ))


                }

            </Div>
            {
                (!dishList || dishList.length === 0) &&
                <P variant="text_black" className="w-full flex justify-center">Không tìm thấy kết quả</P>
            }
            {type !== "home" && !!data?.total &&
                <Div size="full" className=" justify-between">
                    {!!data &&
                        <Div className="mt-10 justify-between px-10" >
                            <P variant="text_black">Hiện có {dishList.length} món ăn</P>
                        </Div>
                    }
                    {
                        !!data?.total && data.total > limits &&
                        <Div className="mt-10 justify-between px-10" >
                            <Pagination
                                totalPages={Math.ceil((data?.total ? data.total / limits : 0))}
                                currentPage={MenuItemPage ?? 1}
                                onPageChange={setMenuItemPage}
                                limit={limits}
                            />
                        </Div>
                    }

                </Div>

            }
        </Div>
    )
}
export default FeaturedDishComponent