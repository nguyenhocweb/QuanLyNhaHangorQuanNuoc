export interface IsActiveBrand_type {
     id:string,
     logo?:string,
     name:string,
     isActive:"ACTIVE"|"PENDING"|"INACTIVE"|"TERMINATED",
    
}
export interface IsActiveBrand_request {
    id:string,
    isActive:""
}