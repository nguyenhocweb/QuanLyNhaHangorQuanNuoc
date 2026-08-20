import cloudinary from "../../config/cloudinary.config.js";
export const uploadMultipleImages = async (files,folder) => {
  try {
    const uploadPromises = files.map((file) => {
      return cloudinary.uploader.upload(file, {
        folder: `quan_ly_nha_hang/${folder}`,
        transformation: [
          { width: 1000, height: 1000, crop: "limit" }, // Giới hạn tối đa 1000px
          { quality: "auto" }
        ]
      });
    });

    const results = await Promise.all(uploadPromises);
    
    // Trả về mảng các URL và ID
    return results.map(result => ({
      url: result.secure_url,
      public_id: result.public_id
    }));
  } catch (error) {
    return null
  }
};
export const uploadSingleImage = async (fileToUpload,folder) => {
  try {
    const result = await cloudinary.uploader.upload(fileToUpload, {
      folder: `quan_ly_nha_hang/${folder}`, // Lưu vào thư mục 'products'
      use_filename: true,
      unique_filename: true,
      // Tối ưu ảnh: Tự động căn giữa, cắt theo tỉ lệ 1:1 cho product
      transformation: [
        { width: 800, height: 800, crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" }
      ]
    });
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    return null
  }
};
