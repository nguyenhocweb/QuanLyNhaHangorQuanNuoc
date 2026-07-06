"use client"
import { Div } from "@/src/core/components/ui"
import CategoryRestaurantComponent from "@/src/features/system_admin/categories/component/CategoryRestaurant_components"

const SytemCategory = () => {
    return (
        <Div vitri="col_none" size="full" className="p-4 md:p-10 min-h-screen bg-gray-50/30">
            <CategoryRestaurantComponent />
        </Div>
    )
}
export default SytemCategory