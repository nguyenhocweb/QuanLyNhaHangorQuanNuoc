"use client"
import { Div, Input, Select, H, Button } from "@/src/core/components/ui";
import { useScrollTo } from "@/src/core/hooks/useScrollTo";
import Featured_Restaurant_Component from "@/src/features/public/restaurant/restaurant_components/demo-card-restaurant/featured-restaurant-component"
import { cities } from "@/src/core/lib/configAddressCity";
import { BiChevronDown } from "react-icons/bi";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
// Dữ liệu cho Lọc theo Giá (Khoảng giá trung bình/người)
const priceRanges = [
  { label: "Tất cả mức giá", value: "" },
  { label: "Dưới 200.000đ", value: "under_200" },
  { label: "Từ 200.000đ - 500.000đ", value: "200_500" },
  { label: "Từ 500.000đ - 1.000.000đ", value: "500_1000" },
  { label: "Trên 1.000.000đ", value: "over_1000" },
];

// Dữ liệu cho Lọc theo Đánh giá
const ratings = [
  { label: "Mọi đánh giá", value: "" },
  { label: "Từ 4.5 sao trở lên", value: 4.5 },
  { label: "Từ 4.0 sao trở lên", value: 4.0 },
  { label: "Từ 3.0 sao trở lên", value: 3.0 },
];
import  useDebounce  from "@/src/core/hooks/useDebounce";
import { usePagination } from "@/src/core/hooks/usePagination";
import { useCategoryRestaurant } from "@/src/features/system_admin/categories/hook/useCategoryRestaurant_hook";
const RestaurantPage = () => {
  const { data: categoryData, isLoading } = useCategoryRestaurant({ page: 1, limit: 100, search: "", status: "true" });
  const restaurantCategories = categoryData?.data || [];
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const scrollToSection = useScrollTo(100); // Tùy chỉnh offset nếu cần
  
  // Các hàm và state liên quan đến phân trang và lọc
  const {setSearch,applyFiltersRestaurant,clean} = usePagination();
  // đặt biến để lấy giá trị đk lọc từ url, nếu có thì gán vào biến còn không thì để rỗng
  const [fitter, setFitter] = useState({
    city: "",
    review: "",
  });
  const HandleFitter_Change=(e:React.ChangeEvent<HTMLSelectElement>)=>{
    const { name, value } = e.target;
    setFitter((prev) => ({
      ...prev,
      [name]: value
    }));
  }
 

  // hàm sử lý nút lọc
  const HandleFitter=()=>{
    applyFiltersRestaurant({
      city: fitter.city,
      review: fitter.review,
      categories: selected
    })
    
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
    <Div vitri="col_none" className=" gap-y-40" size="full" >
      <div className="relative h-screen w-full  overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          className="w-full h-full object-cover"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />

        {/* content */}
        <div className="absolute inset-0 flex flex-col justify-center px-10 text-white space-y-4">
          <p className="uppercase text-sm tracking-wider text-green-400">
            Premium Dining System
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-xl">
            Khám phá hệ thống nhà hàng cao cấp
          </h1>

          <p className="text-gray-200 max-w-md">
            Đặt bàn nhanh chóng, trải nghiệm ẩm thực tinh hoa từ các thương hiệu hàng đầu.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              className="bg-green-600 px-6 py-3 rounded-xl font-medium hover:bg-green-700"
              onClick={() => scrollToSection("restaurants")}
            >
              Khám phá ngay
            </button>
          </div>
        </div>
      </div>

      <Div id="restaurants" vitri="col_none" className=" gap-y-10 items-center " size="full" >
        <H variant="text_black" className="text-3xl text-start w-full pl-10">Hệ thống nhà hàng</H>
        <Div className="flex gap-5 justify-between px-20 text-black" size="full">
          <Input className="text-black w-80" placeholder="Tìm kiếm tên nhà hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* lọc */}
          <Div gap="g2_3">

            <Select name="city" id="city" className="text-black" onChange={HandleFitter_Change}>
              {cities.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </Select>

            {/* chọn loại nhà hàng */}
            <Div className="relative">
              <Button variant="outline" sizea="p2_1"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                Loại nhà hàng <BiChevronDown className="text-xl" />
              </Button>
              {showDropdown &&
                <div className="absolute z-1 top-full bg-white max-h-100 overflow-y-auto space-y-2 pr-1 border border-gray-700 rounded-lg mt-1 w-full p-2">
                  {
                  restaurantCategories?.map((category) => {
                    const active = selected.includes(category.id)

                    return (
                      <div
                        key={category.id}
                        onClick={() => toggle(category.id)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition
              ${active
                            ? "bg-green-50 border border-green-400"
                            : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                          }`}
                      >
                        <span className="text-sm">{category.name}</span>

                        {/* checkbox custom */}
                        <div
                          className={`w-3 h-3 flex items-center justify-center rounded-sm border
                ${active
                              ? "bg-green-600 border-green-600 text-white"
                              : "border-gray-300"
                            }`}
                        >
                          {active && <FaCheck size={14} />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              }
            </Div>

              {/* lọc theo đánh giá */}
              <Select name="review" id="danhgia" className="text-black" onChange={HandleFitter_Change}>
              {ratings.map((rating) => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </Select>

            {/* nút lọc  */}
            <Button variant="green" sizea="p3_2" onClick={HandleFitter}>
              Lọc <FaFilter className="ml-2" />
            </Button>
          </Div>
          {/* end lọc */}
        </Div>






        {/* danh sách nhà hàng */}
        <Div >
          <Featured_Restaurant_Component type="page" />
        </Div>


      </Div>

    </Div>


  )
}
export default RestaurantPage