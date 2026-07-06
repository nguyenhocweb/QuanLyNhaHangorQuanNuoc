import { Button, Div } from "@/src/core/components/ui";
const STATUS_OPTIONS = [
    {
        label: "Hoạt động",
        value: "ACTIVE"
    },
    {
        label: "Chờ duyệt",
        value: "PENDING"
    },
    {
        label: "Tạm ngưng",
        value: "INACTIVE"
    },
    {
        label: "Đã chấm dứt",
        value: "TERMINATED"
    },
]
import { IoClose } from "react-icons/io5";
import { IsActiveBrand_type } from "../brands_type/isActiveBrand-type";
import { image } from "framer-motion/client";
interface ActiveBrand_type extends IsActiveBrand_type {
    onclickCloseActive: () => void
}
const IsActiveBrand_component = ({ id, isActive, logo, name, onclickCloseActive }: ActiveBrand_type) => {

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="w-[420px] relative bg-white rounded-2xl shadow-xl overflow-hidden">
                <button
                    onClick={() => { onclickCloseActive() }}
                    className=" absolute  top-2 right-2 text-2xl text-gray-400 hover:text-black"
                >
                    <IoClose />
                </button>
                {/* Header */}
                <div className="  p-5 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold">Cập nhật trạng thái</h2>
                        <p className="text-sm text-gray-500">
                            Thay đổi trạng thái hoạt động của thương hiệu
                        </p>
                    </div>

                </div>

                {/* Body */}
                <div className="p-5 space-y-5">

                    {/* Brand Info */}
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                        <div className="w-10 h-10 bg-black text-white overflow-hidden  flex items-center justify-center rounded-lg text-sm font-bold">
                            {
                                logo?
                                <img
                                src={logo}
                                className=" object-cover object-center"
                                />
                                :name.split("")[0]
                            }
                        </div>
                        <div>
                            <p className="font-medium">{name}</p>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                               {STATUS_OPTIONS.find((e)=>e.value===isActive)?.label}
                            </span>
                        </div>
                    </div>

                    {/* Select status */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">
                            Trạng thái mới
                        </label>
                        <select
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {STATUS_OPTIONS.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">
                            Lý do thay đổi
                        </label>
                        <textarea
                            placeholder="Nhập lý do cập nhật trạng thái..."
                            className="w-full border rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-5 border-t">
                    <Button variant="red" sizea="p4_2" onClick={() =>  onclickCloseActive() }>Hủy</Button>

                    <Button variant="green" sizea="p4_2">Xác nhận cập nhật</Button>
                </div>
            </div>
        </div>

    )
}
export default IsActiveBrand_component