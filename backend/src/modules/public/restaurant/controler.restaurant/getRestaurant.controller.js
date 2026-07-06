import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getRestaurantService } from "../service.restaurant/getRestaurant.service.js";
import {NotFoundError} from "../../../../core/constants/error/index.js"
const getRestaurantController=asyncHandler(
    async(req,res)=>{
        const id=req.params.id;
        const result=await getRestaurantService(id);
        switch (result.code) {
            case 404:
                throw new NotFoundError(result.mes);
            case 200:
                return res.status(200).json(result.data);
                
        }
    }
)

export default getRestaurantController