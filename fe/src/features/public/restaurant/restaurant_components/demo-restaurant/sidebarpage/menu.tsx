import { Div, H } from "@/src/core/components/ui"
import FeaturedDishComponent from "@/src/features/public/dish/dish_component/featured-dish-component"
const MenuPage = ({ idRestaurant }: { idRestaurant: string }) => {
    return (
        <Div id="menu" vitri="col_none" variant="bg_white" size="full">
            <H variant="text_black" className="text-2xl font-bold mb-4">Menu</H>
          
                <FeaturedDishComponent id={idRestaurant} type="isRestaurant" grid={3} limit={6} />
          
        </Div>
    )
} 
export default MenuPage