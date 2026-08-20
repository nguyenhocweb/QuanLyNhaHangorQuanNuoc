import {v4 as uuidv4} from "uuid";
export default (ky_tu_dau,so_ky_tu)=>{
      let id = uuidv4();
      id=`${ky_tu_dau}-${id.replace(/-/g,"")}`
      id=id.slice(0,so_ky_tu);
      return id;
}