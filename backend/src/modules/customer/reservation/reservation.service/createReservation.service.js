import Create_chuoi from "../../../../core/utils/Create_chuoi.js";
import { createReservation } from "../reservation.repository/index.js";
import { calculateEndTime } from "../../../../core/utils/calculateEndTime.js";
import { Prisma } from "../../../../databases/prisma/generated/prisma/index.js";
export const createReservationService = async (data) => {
        const initial = data.guest_name
                .split(/\s+/)            // Tách chuỗi bởi khoảng trắng
                .map(word => word[0])    // Lấy ký tự đầu của mỗi từ
                .join("")                // Ghép lại thành chuỗi
                .toUpperCase();

        if (!data.end_time) {
                data.end_time = calculateEndTime(data.start_time, 3)
        }


        for (var i = 0; i < 3; i++) {
                try {

                        const confirmation_code = Create_chuoi(initial, 12);
                        data.confirmation_code = confirmation_code
                        const result = await createReservation(data);
                        console.log(i, result);

                        return { code: 201, mes: "đã tạo thành công" }
                } catch (error) {
                        if (error instanceof Prisma.PrismaClientKnownRequestError) {
                                if (error.code === 'P2002') {
                                        // Kiểm tra xem có phải trùng ở field confirmation_code không
                                        const target = error.meta?.target;
                                        if (target.includes('confirmation_code')) {
                                                console.warn(`Lần thử ${i + 1}: Trùng mã ${data.confirmation_code}, đang thử lại...`);
                                                continue;
                                                
                                        }
                                }
                        }
                        console.log(error);
                        
                        return {code:409,mes:"Dữ liệu bị trùng"}
                }
        }


} 