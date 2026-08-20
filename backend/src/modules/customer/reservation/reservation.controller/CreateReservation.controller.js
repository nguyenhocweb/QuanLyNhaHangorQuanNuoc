import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createReservationService } from "../reservation.service/createReservation.service.js";
import {ConflictError} from "../../../../core/constants/error/index.js"
export const createReservationController=asyncHandler(
    async(req,res)=>{
        const data=req.body
       const result= await createReservationService(data);
       switch (result.code) {
        case 201:
            return res.status(201).json(result.mes);
            
        case 409: throw new ConflictError(result.mes)
       }
    }
)