import { Div, Button, Select, Input } from "@/src/core/components/ui";
// const FILTERS = [
//     { key: "all", label: "Tất cả" },
//     { key: "new", label: "Mới" },
//     { key: "featured", label: "Tiêu biểu" },
//     { key: "asia-eu", label: "Á - Âu" },
// ];
const provinces = [
    "Hà Nội",
    "Hà Giang",
    "Cao Bằng",
    "Bắc Kạn",
    "Tuyên Quang",
    "Lào Cai",
    "Yên Bái",
    "Sơn La",
    "Phú Thọ",
    "Vĩnh Phúc",
    "Bắc Ninh",
    "Bắc Giang",
    "Quảng Ninh",
    "Hải Dương",
    "Hải Phòng",
    "Hòa Bình",
    "Hưng Yên",
    "Thái Bình",
    "Hà Nam",
    "Nam Định",
    "Ninh Bình",
    "Thanh Hóa",
    "Nghệ An",
    "Hà Tĩnh",
    "Quảng Bình",
    "Quảng Trị",
    "Thừa Thiên Huế",
    "Đà Nẵng",
    "Quảng Nam",
    "Quảng Ngãi",
    "Bình Định",
    "Phú Yên",
    "Khánh Hòa",
    "Ninh Thuận",
    "Bình Thuận",
    "Kon Tum",
    "Gia Lai",
    "Đắk Lắk",
    "Đắk Nông",
    "Lâm Đồng",
    "Bình Phước",
    "Tây Ninh",
    "Bình Dương",
    "Đồng Nai",
    "Bà Rịa - Vũng Tàu",
    "TP. Hồ Chí Minh",
    "Long An",
    "Tiền Giang",
    "Bến Tre",
    "Trà Vinh",
    "Vĩnh Long",
    "Đồng Tháp",
    "An Giang",
    "Kiên Giang",
    "Cần Thơ",
    "Hậu Giang",
    "Sóc Trăng",
    "Bạc Liêu",
    "Cà Mau"
];
import useDebounce from "@/src/core/hooks/useDebounce";
import React, { useState,useEffect } from "react";
import { usePagination } from "@/src/core/hooks/usePagination";
const BrandFilterBar = () => {
    const { setSearch, setCity, clean, } = usePagination()
    const [keyword, setKeyword] = useState("all");
    // const HandleKey = (key: string) => {
    //     setKeyword(key)
    // }
    const handleCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "all") return clean("city");
        setCity(value)
    }
   

     const [searchTerm, setSearchTerm] = useState("");
        const debouncedSearchTerm = useDebounce({value:searchTerm,delay:1000});
        useEffect(()=>{
            if(debouncedSearchTerm){
             
                setSearch(debouncedSearchTerm)
            }
               if(debouncedSearchTerm==="") return clean("search");
            
        },[debouncedSearchTerm])
    return (
        <Div className=" justify-between px-10" size="full">
            <Div className=" justify-start " gap="g2_3">
                {/* {FILTERS.map((e, index) => (
                        <Button key={index} variant={keyword === e.key ? "green" : "gray"} sizea="p3_2"
                            onClick={() => { HandleKey(e.key) }}
                        >
                            {e.label}
                        </Button>
                    )
                    )} */}

            </Div>
            <Div gap='g4_5'>
                <Select variant="gray" sizea="p3_2"
                    onChange={handleCity}
                >
                    <option value="all">tất cả</option>
                    {
                        provinces.map((e, index) => (
                            <option value={e} key={index}>{e}</option>
                        ))
                    }
                </Select>
                <Input placeholder="tìm thương hiệu" className="text-black"
                onChange={(e)=>{setSearchTerm(e.target.value)}}
                />
            </Div>
        </Div>

    )
}
export default BrandFilterBar