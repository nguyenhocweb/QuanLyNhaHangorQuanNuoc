import { useTableHook } from "../table_hook/useTable_hook"
import Loading from "@/src/core/components/layout/public-loading"
import { Div, Button, H, P } from "@/src/core/components/ui";
import { useState, useMemo, useEffect } from "react";
import { ReservationForm } from "@/src/features/customer/reservation/reservation_schemas/createReservation_schemas";

import ScrollMenu from "@/src/core/components/layout/ScrollMenu";
import { toast } from "sonner"
import { useCreateReservation } from "@/src/features/customer/reservation/reservation_hook/useCreateReservation_hook";

const tableLegend = [
    { key: "empty", label: "Còn trống" },
    { key: "selecting", label: "Đang chọn" },
    { key: "reserved", label: "Đã đặt" },
    { key: "vip", label: "Bàn VIP" }
];

const TableComponent = ({ data1, onclick }: { data1: ReservationForm, onclick: () => void }) => {
    
    const { mutate: createResvervation, isPending } = useCreateReservation()
    
    const { data, isLoading } = useTableHook({
        idRestaurant: data1.idRestaurant,
        reservation_date: data1.reservation_date,
        start_time: data1.start_time,
        end_time: data1.end_time ?? undefined
    })
console.log(data);

    // 1. TẤT CẢ HOOKS Ở TRÊN CÙNG
    // Khởi tạo state là undefined, không gọi data[0] ở đây
    const [selectedFloor, setSelectedFloor] = useState<number | undefined>(undefined);
    const [selectTable, setSelectTable] = useState<string[]>([])

    // 2. Dùng useEffect để set giá trị mặc định cho selectedFloor khi data đã load xong
    useEffect(() => {
        if (data && data.length > 0 && selectedFloor === undefined) {
            setSelectedFloor(data[0].floor_number);
        }
    }, [data, selectedFloor]);

    const handleSelectFloor = (floorNumber: number) => {
        setSelectedFloor(floorNumber);
    };

    const currentArea = useMemo(() => {
        // Thêm Optional Chaining (?.) để an toàn
        return data?.find(item => item.floor_number === selectedFloor);
    }, [selectedFloor, data]);


    const HandleSelectTable = (id: string) => {
        setSelectTable((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    }

    const HandleResvervation = () => {
        if (selectTable.length === 0) {
            toast.warning("Vui lòng chọn bàn")
        } else {
            createResvervation({ ...data1, tables: selectTable })
        }
    }
    
    // 3. XỬ LÝ LOADING VÀ RỖNG SAU KHI ĐÃ KHAI BÁO HẾT HOOKS
    if (isLoading) return <Loading />
    if (!data || data.length === 0) return <P className="p-4 text-center">Không có dữ liệu bàn cho thời gian này.</P>

    return (
        <Div vitri="col_none" size='full' variant="bg_white" className="sticky top-16" gap="g2_3">

            <Div>
                {/* chọn khu vực */}
                <Div gap="g4_5" className=" p-5 w-100 rounded-none"  >
                    <ScrollMenu
                        totalItems={data.length} 
                        itemWidth={80}        
                        gap={20}
                    >
                        {data.map((area, index) => (
                            <Button
                                key={index}
                                variant={selectedFloor === area.floor_number ? "black" : "gray"}
                                sizea="p4_2"
                                onClick={() => handleSelectFloor(area.floor_number)}
                                className="whitespace-nowrap flex-shrink-0 w-20"

                            >
                                Tầng {area.floor_number}
                            </Button>
                        ))}
                    </ScrollMenu>
                </Div>
            </Div>
            {/* thông tin tầng  */}
            <Div vitri="col_none">
                <Div>
                    <H variant="text_black"> Tầng {currentArea?.floor_number}</H>
                    <H variant="text_black">{currentArea?.name}</H>
                </Div>
                <P>{currentArea?.description}</P>

            </Div>
            {/* chú thích */}
               <Div grids="col_2" size="full">
                  {
                    tableLegend.map((e)=>
                    <Div key={e.key} size="full" className=" justify-start">
                        <Button 
                        variant={e.key==="reserved"?"tabel_red":e.key==="selecting"?"tabel_green":"tabel_gray"}
                        bordera={e.key==="vip"?"yellow":"default"}
                        className="w-5 h-5"
                        >
                        </Button>
                        <P>{e.label}</P>
                    </Div>
                    )
                  }
               </Div>

            {/* table */}
            <Div className=" grid grid-cols-5 gap-3 ">
                {
                    currentArea?.tables?.map((e) => (
                        <Button key={e.id}
                            disabled={e.isBooked}
                            variant={e.isBooked ? "tabel_red" : selectTable.includes(e.id) ? "tabel_green" : "tabel_gray"}
                            onClick={() => { HandleSelectTable(e.id) }}
                            bordera={e.is_vip ? "yellow" : "default"}
                            className={`px-4 py-1 w-19 ${e.isBooked ? "cursor-not-allowed" : "cursor-pointer"}`}
                            title={
                                `bàn số ${e.table_number}\nbàn: ${e.isBooked ? "Đã được đặt rồi" : "còn trống"} \nsố lượng người : ${e.min_capacity}-${e.max_capacity}\n bàn: ${e.is_vip ? "vip" : "thường"}\n bàn dạng:${e.shape}`}
                        >
                            {e.table_number} <br />
                            {e.min_capacity}-{e.max_capacity}
                        </Button>
                    ))
                }
            </Div>
            <Div vitri='col_none'>
                <H variant="text_black">Thông tin cơ bản </H>
                <Div grids='col_3' gap="g1_2">
                    <Div>
                        <H className="text-sm">Họ & tên: </H>
                        {/* LƯU Ý: Vẫn đang là data1.guest_name */}
                        <P className="text-sm w-15" line='truncate_1line' title={data1.guest_name}>{data1.guest_name}</P> 
                    </Div>
                    <Div>
                        <H className="text-sm">Sđt: </H>
                        <P className="text-sm">{data1.guest_phone}</P>
                    </Div>
                    <Div>
                        <H className="text-sm">Số người: </H>
                        <P className="text-sm">{data1.party_size}</P>
                    </Div>
                </Div>
            </Div>
            <Div size="full" className=" justify-between">
                <Button variant="gray" sizea="p4_2" onClick={() => { onclick() }}>Trước</Button>
                <Button variant="green" sizea="p4_2" onClick={()=>{HandleResvervation()}} >Đặt bàn</Button>
            </Div>
        </Div>

    )
}
export default TableComponent