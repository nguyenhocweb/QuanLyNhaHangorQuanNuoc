"use client"
import { Div ,Button} from '@/src/core/components/ui';
const SidebarRestaurant = [
    {
        id: 1,
        name: "Tổng quan",        // có thể đổi thành "Thông tin chung" hoặc "Giới thiệu"
        idHtml: "overview"
    },
    {
        id: 2,
        name: "Quy định",  // có thể đổi thành "Chính sách" hoặc "Quy tắc"
        idHtml: "policy"
    },
    {
        id: 3,
        name: "Menu",  // có thể đổi thành "Thực đơn" hoặc "Món ăn"
        idHtml: "menu"
    },
    {
        id: 4,
        name: "tiện ích", // có thể đổi thành "Dịch vụ" hoặc "Tiện nghi"
        idHtml: "amenities"
    },
    {
        id: 5,
        name: "giờ hoạt động", // giờ hoạt động trong tuần
        idHtml: "business_hours"
    },
    {
        id: 6,
        name: "ảnh",  // có thể đổi thành "Hình ảnh" hoặc "Bộ sưu tập"
        idHtml: "images"
    },
    {
        id: 7,
        name: "map",
        idHtml: "map"
    },
    {
        id: 8,
        name: "Đánh giá",
        idHtml: "reviews"
    },
]
import { useScrollSpy } from '@/src/core/hooks/useScrollSpy';
import { useScrollTo } from '@/src/core/hooks/useScrollTo';
const SidebarPage = () => {
    const sectionIds=SidebarRestaurant.map(e=>e.idHtml);
    const activeId=useScrollSpy(sectionIds)
     const scrollTo = useScrollTo(150);
    return (
        <Div variant="bg_white" size="full" className=' justify-between z-1 sticky top-15'>
           {
            SidebarRestaurant.map(
                e=>
                  <Button key={e.id} 
                sizea="p4_2" 
                variant={activeId===e.idHtml?"green_shadow":"gray"} 
                shape={e.idHtml===activeId?"before_Square":"square"}
                onClick={()=>scrollTo(e.idHtml)} 
                >{e.name}</Button>
            )
           }
        </Div>
    )
}
export default SidebarPage