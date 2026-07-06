import { use } from "react";
import RestaurantTemplate1 from "@/src/features/public/restaurant/restaurant_components/demo-restaurant/RestaurantTemplate1"
const RestaurantItem = (
    { params }: {
        params: Promise<{ idRestaurant: string }>
    }) => {
    const { idRestaurant } = use(params);
    
   

  return (
    <RestaurantTemplate1 id={idRestaurant}/>
  )
}
export default RestaurantItem