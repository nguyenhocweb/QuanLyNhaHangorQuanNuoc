export interface Card_Dish_Type {
    id:string,
    restaurantName?:string,
    brandName?:string,
    name:string,
    base_price:number,
    description?:string,
    image:string,
    is_featured:boolean
}
export interface Card_Brand_Dish_Type {
    id:string,
    name:string,
    base_price:number,
    description?:string,
    image:string,
    is_featured:boolean
}
export interface DishCardRequestType {
  id?:string,// dùng để phân biệt khi gọi api theo brand hay restaurant
  page:number,
  limit:number,
  type:"home"|"isBrand"|"isRestaurant",
  search?:string
}
export interface DishCardResponseType {
    data:Card_Dish_Type[]|Card_Brand_Dish_Type[],
    total:number
}
