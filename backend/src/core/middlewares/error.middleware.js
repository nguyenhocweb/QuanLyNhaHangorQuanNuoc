// src/middlewares/error.middleware.js
import { ApiError } from '../constants/error/index.js';
import {appConfig} from "../../config/app.config.js"

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Nếu lỗi không phải là ApiError (ví dụ lỗi cú pháp, lỗi database crash...)
  // Ta convert nó về dạng ApiError để có cấu trúc chuẩn
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(message, statusCode);
  }

  // 2. Cấu trúc response trả về cho Client
  const response = {
    status: error.status, // 'error' hoặc 'fail'
    code: error.statusCode,
    message: error.message,
    // Chỉ hiện stack trace (dòng lỗi) khi ở môi trường Dev
    stack: appConfig.node === 'development' ? error.stack : undefined
  };

  console.error(`ERROR: ${error.message}`); // Ghi log server

  // 3. Trả về JSON
  res.status(error.statusCode).json(response);
};

