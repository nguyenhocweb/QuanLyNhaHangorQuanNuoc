import cloudinary from "../../../../config/cloudinary.config.js"
import "dotenv/config.js";
export const cloudinarySignatureService=async(folder,public_id)=>{
    // Lấy thời gian hiện tại (tính bằng giây)
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // Bạn có thể thêm các tham số khác như folder, tags...
  // BẤT KỲ tham số nào upload lên Cloudinary cũng phải được đưa vào đây để ký
  const paramsToSign = {
    timestamp: timestamp,
    folder: folder, // Ví dụ: lưu vào thư mục này trên Cloudinary
    transformation: "w_800,h_800,c_limit/q_auto,f_auto"
  };
  if (public_id) {
    paramsToSign.public_id = public_id;
  }
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );
  return {
    signature,
    timestamp,
    folder,
    transformation: "w_800,h_800,c_limit/q_auto,f_auto",
    public_id: public_id, // FE sẽ cần biến này
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_NAME
  }
}