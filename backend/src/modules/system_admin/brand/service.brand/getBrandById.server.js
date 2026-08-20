import { getBrandById } from "../repository.brand/index.js";
import {NotFoundError} from "../../../../core/constants/error/index.js";
export const getBrandByIdService=async(_id)=>{
    const brand=await getBrandById(_id);
    if(!brand){
        throw new NotFoundError("Brand not found");
    }
    return brand?{code:200,data:brand}:{code:404,mes:"không tìm thấy tài nguyên"}
} 