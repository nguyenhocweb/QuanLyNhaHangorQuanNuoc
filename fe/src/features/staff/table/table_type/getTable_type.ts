export interface getTableRequest {
    idRestaurant: string,
    reservation_date: Date,
    start_time: string,
    end_time?: string
}

export interface getTableResponse {
     id:string,
     table_number:string,
     min_capacity:number,
     max_capacity:number,
     shape?:string,
     is_vip:boolean,
     isBooked:boolean
}
export interface getAreaAndTableResponse {
    floor_number: number // tầng máy
    is_outdoor:boolean   // vieew ngoài trời hay không
    description?:string   // mô tả khu vực
    smoking_allowed:boolean  // cho hút thuốc ko
    name?:string,
    tables: getTableResponse[]
} 