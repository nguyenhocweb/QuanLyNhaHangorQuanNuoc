import {queryVector} from "../../../shared/vector/service/vectorDB.service.js";
import {embedText} from "../../../shared/vector/service/embedding.service.js";
export const searchAIService=async({query, topK , filter})=>{
    // Xử lý truy vấn và trả về kết quả
    // Ví dụ: Tìm kiếm trong cơ sở dữ liệu hoặc gọi API bên ngoài
   
    const vector = await embedText(query);
    const results = await queryVector({ 
        vector ,
         topK, 
         filter:filter ?? {}
     });
   if (!results || results.length === 0) {
        return [];
    }
        return results.map(result => {
            const [type, id] = result.id.split("_");
            return { type, id };
        });
    
}
export const chatBoxAiService=async(mes)=>{
            
}