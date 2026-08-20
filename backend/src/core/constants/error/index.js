// src/core/error.response.js

/**
 * Class cha xử lý lỗi API chung
 * @extends Error
 */
export class ApiError extends Error {
  /**
   * @param {string} message - Thông báo lỗi
   * @param {number} statusCode - Mã lỗi HTTP (4xx, 5xx)
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    
    // Nếu status code bắt đầu bằng 4 (400, 404...) -> fail, còn lại (500) -> error
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // True: Lỗi do người dùng/logic (biết trước). False: Lỗi crash hệ thống.
    this.isOperational = true; 

    // Loại bỏ chính constructor này khỏi stack trace để log sạch hơn
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Lỗi 400 - Dữ liệu gửi lên không hợp lệ
 */
export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
} 

/**
 * Lỗi 401 - Chưa đăng nhập hoặc Token sai
 */
export class AuthFailureError extends ApiError {
  constructor(message = 'Invalid Credentials') {
    super(message, 401);
  }
}

/**
 * Lỗi 404 - Không tìm thấy tài nguyên
 */
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Lỗi 403 - Có đăng nhập nhưng không đủ quyền hạn
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Permission denied') {
    super(message, 403);
  }
}

/**
 * Lỗi 409 - Xung đột dữ liệu (Thường dùng khi dữ liệu đã tồn tại)
 */
export class ConflictError extends ApiError {
  constructor(message = ReasonPhrases.CONFLICT) {
    super(message, StatusCodes.CONFLICT);
  }
}
// lỗi 409
//cách dùng chung:
//throw new tên_lỗi 1 in 5 class('Nhà hàng này đã tồn tại trong hệ thống!');