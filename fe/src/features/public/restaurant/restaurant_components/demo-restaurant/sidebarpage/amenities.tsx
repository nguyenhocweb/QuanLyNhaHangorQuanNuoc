const amenities = [
  { name: "Chỗ hút thuốc", available: true },
  { name: "Điều hòa", available: true },
  { name: "Visa / Master card", available: true },
  { name: "Hóa đơn VAT", available: true },
  { name: "Wifi", available: true },
  { name: "Máy chiếu", available: false },
  { name: "Âm thanh - ánh sáng", available: false },
  { name: "HD trực tiếp", available: false },
  { name: "Ghế trẻ em", available: false },
  { name: "Chỗ để ô tô", available: false },

  { name: "MC dẫn chương trình", available: false },
  { name: "Bàn ngoài trời", available: false },
  { name: "Bóng đá K+", available: false },
  { name: "Chỗ để xe máy", available: false },
  { name: "Phòng riêng", available: false },
  { name: "Karaoke", available: false },
  { name: "Momo / Zalo Pay", available: false },
  { name: "Trang trí sự kiện", available: false },
  { name: "Màn LED", available: false },
  { name: "Chỗ chơi trẻ em", available: false },
];
import { AiFillCheckCircle,AiFillCloseCircle } from "react-icons/ai";
import { Div,H,P } from "@/src/core/components/ui";
const AmenityPage=()=>{
     return (
      
      <Div id="amenities" vitri="col_none" variant="bg_white" size="full">
        
            <H variant="text_black" className="text-2xl font-bold mb-4">Tiện ích</H>
             <Div vitri='col_none' className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10" size="full"> 
                    {
                        amenities.map((e,index)=>(
                            <Div key={index} className=" justify-start">
                                  <span>
                                    {
                                        e.available?
                                        <AiFillCheckCircle className="text-green-600 text-2xl"/>
                                        :
                                        <AiFillCloseCircle className="text-red-600 text-2xl"/>
                                    }
                                  </span>
                                     <P variant="text_black" className=" font-medium text-md">{e.name}</P>
                            </Div>
                        ))
                    }
             </Div>
      </Div>
     )
}
export default AmenityPage