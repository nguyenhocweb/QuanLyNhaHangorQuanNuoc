import { UpdateUserById} from "../repository/index.js";

import { NotFoundError } from "../../../../core/constants/error/index.js";
export const updateImageProfileService = async (id,  urlAvatar) => {
     const result=await UpdateUserById(id,{avatar:urlAvatar},{avatar:true});
     if(!result)  { throw new NotFoundError("người dùng tồn tại") }
     return result

}
