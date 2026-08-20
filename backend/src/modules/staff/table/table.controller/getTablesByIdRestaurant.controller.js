import asyncHandle from "../../../../core/utils/asyncHandler.js";
import {NotFoundError} from "../../../../core/constants/error/index.js"
import { getTablesByIdRestaurantService } from "../table.service/getTablesByIdRestaurant.service.js";
export const getTablesByIdRestaurantController=asyncHandle(
    async(req,res)=>{
       const {reservation_date, start_time, end_time}=req.query 
       const idRestaurant=req.params.idRestaurant

       const result= await getTablesByIdRestaurantService(idRestaurant,reservation_date,start_time,end_time)
       switch (result.code) {
        case 404 :
            throw new NotFoundError(result.mes);
        case 200:
            return res.status(200).json(result.data);
            
    }
}
);
