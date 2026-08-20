export interface BrandCardType {
  id: string;
  name: string;
  description?: string;
  imageMain: string;
  logo?: string; // VD: "AS", "LA", "VI" trong vòng tròn
  numberRestaurant?: number;
  taxCode?: string;
  emailContact?: string;
  phoneContact?: string;
  address?: any;
  createdAt?: string;
  isActive?: string;
  link?: string;
}
export interface BrandCardResponseType{
  data:BrandCardType[],
  total:number
}
export interface BrandCardRequestType {
  page:number,
  limit:number,
  city?:string,
  search?:string,
  isFeatured?:boolean,
  isNew?:boolean
}