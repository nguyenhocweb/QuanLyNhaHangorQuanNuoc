export default {
    OK: 200,//Thành công, có dữ liệu trả về
    CREATED: 201,//Tạo mới thành công
    ACCEPTED: 202,// Request đã được nhận, xử lý chưa xong
    NO_CONTENT: 204, //Thành công nhưng KHÔNG có body trả về
    BAD_REQUEST: 400,//Client gửi dữ liệu sai
    UNAUTHORIZED: 401,//Chưa đăng nhập / Token sai
    FORBIDDEN: 403,//Đã đăng nhập nhưng không có quyền
    NOT_FOUND: 404,//Không tìm thấy tài nguyên
    CONFLICT: 409, //Dữ liệu bị trùng
    INTERNAL_SERVER_ERROR: 500,//Lỗi phía server

};