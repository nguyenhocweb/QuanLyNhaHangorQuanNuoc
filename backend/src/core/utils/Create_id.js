import {v4 as uuidv4} from "uuid";
export default (ky_tu_dau)=>{
      let id = `${ky_tu_dau}${uuidv4()}`;
      id=id.replace(/-/g,"").slice(0,20);
      return id;
}