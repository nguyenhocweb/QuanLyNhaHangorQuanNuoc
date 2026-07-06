"use client"
import { Div } from "@/src/core/components/ui"
import RestaurantComponent from "@/src/features/system_admin/restaurants/component/Restaurant_components"

const SytemRestaurant = () => {
    return (
        <Div vitri="col_none" size="full" className="p-4 md:p-10 min-h-screen bg-gray-50/30">
            <RestaurantComponent />
        </Div>
    )
}
export default SytemRestaurant
