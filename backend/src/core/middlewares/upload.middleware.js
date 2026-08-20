import multer from 'multer';
import path from 'path';

// Cấu hình lưu trữ tạm thời
const storage = multer.memoryStorage(); 

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Chỉ chấp nhận định dạng ảnh (jpg, jpeg, png, webp)!"));
    }
});