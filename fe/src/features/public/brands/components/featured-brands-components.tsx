"use client";

import Brand_Card from "./brand-card-components";
import { Div, P, A } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";

import { useBrandCard_hook } from "../hooks/useBrandCard_hook";
import Loading from "@/src/core/components/layout/public-loading"
import Pagination from "@/src/core/components/layout/Pagination";
import { usePagination } from "@/src/core/hooks/usePagination";

const featuredBrandComponent = ({ type }: { type: "home" | "page" }) => {

    const { currentPage, setPage, searchKeyword, city} = usePagination()
    // lấy thông tin từ url
   
    const currentLimit = type === "home" ? 5 : 10;

    
    const { data, isLoading, isFetched } = useBrandCard_hook({ page: currentPage, limit: currentLimit, search: searchKeyword ?? undefined, city: city ?? undefined });
    if (isLoading) return (<Loading />)
    const brandList = data?.data
    return (
        <Div id="brandHome" vitri="col_none"   >
            <Div className="justify-between mb-8 " size="full" >
                <Div className={`flex-col ${type === "home" ? "items-start" : "items-center"}`} size="full">
                    <FadeIn>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Thương hiệu đối tác
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <P>
                            Mỗi nhà hàng là một câu chuyện về hương vị và sự sáng tạo không giới hạn.
                        </P>
                    </FadeIn>
                </Div>
                {
                    type === "home" &&
                    <FadeIn delay={0.1}>
                        <A href="/brands" colors="green">Xem {(data?.total ?? 0) > 99 ? "99+" : (data?.total ?? 0)} thương hiệu →</A>
                    </FadeIn>
                }
            </Div>
            <Div gap="g2_3" variant="card">
                {
                    brandList &&
                    brandList.map((e, index) => (
                        <Brand_Card key={e.id} dataBrand={e} index={index} />
                    ))
                }
            </Div>

            {
                type === "page" && !!data?.total &&
                <Div className="mt-10 justify-between px-10" size="full">
                    <P variant="text_black">Hiện có {data.total} thương hiệu</P>
                    <Pagination
                        totalPages={Math.ceil((data?.total ? data.total / currentLimit : 0))}
                        currentPage={currentPage}
                        onPageChange={setPage}
                        limit={currentLimit}
                    />
                </Div>
            }
            {
                !data?.total &&
                <Div className="flex-col justify-center" size="full">
                    <P variant="text_black">Không tìm thấy kết quả</P>
                </Div>
            }
        </Div>
    )
}
export default featuredBrandComponent