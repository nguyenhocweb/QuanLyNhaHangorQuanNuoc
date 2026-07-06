
import { SchemaType } from "@google/generative-ai";
const filterItemSchema = {
    type: SchemaType.OBJECT,
    properties: {
        field: {
            type: SchemaType.STRING,
            enum: ['description',
                'name',
                'discount_percent',
                'base_price',
                'discount_until',
                `totalRating`,
                'createdAt',
                'is_available',
                'is_featured',
                'item_type',
                "allergens",
                'brand.name',
                'restaurant.name',
                'category.name'
            ],
            // DẠY AI Ở ĐÂY: Phân loại rõ ràng từng trường
           // DẠY AI Ý NGHĨA VÀ KIỂU DỮ LIỆU CỦA TỪNG TRƯỜNG
            description: `Trường dữ liệu cần lọc. Hướng dẫn chi tiết cho AI:
            - name (chuỗi): Tên món ăn/thức uống.
            - description (chuỗi): Mô tả chi tiết món ăn.
            - base_price (số): Giá gốc của món ăn.
            - discount_percent (số): Phần trăm giảm giá (VD: 10, 20).
            - discount_until (ngày tháng): Thời hạn áp dụng giảm giá.
            - totalRating (số): Tổng điểm đánh giá trung bình.
            - createdAt (ngày tháng): Thời gian tạo/thêm món vào hệ thống.
            - is_available (boolean): Trạng thái còn hàng hay hết hàng.
            - is_featured (boolean): Đánh dấu món nổi bật/bán chạy/đặc biệt.
            - item_type (enum): Phân loại món ("FOOD":Món ăn chế biến, "DRINK":Đồ uống (Cà phê, nước ngọt...), "ALCOHOL", "DESSERT", "SIDE_DISH", "TOPPING", "COMBO", "SERVICE", "OTHER").
            - allergens (array): Danh sách các chất gây dị ứng có trong món ăn (VD: đậu phộng, hải sản).
            - [LỌC CHÉO] brand.name (chuỗi): Tìm theo tên Thương hiệu.
            - [LỌC CHÉO] restaurant.name (chuỗi): Tìm theo tên Nhà hàng/Chi nhánh.
            - [LỌC CHÉO] category.name (chuỗi): Tìm theo tên Danh mục chứa món ăn đó.`
        },
        operator: {
            type: SchemaType.STRING,
            enum: ['equals', 'contains', 'gte', 'lte', 'in'],
            // 'equals' = , 'contains' chứa, 'gte' >=, 'lte' <=, 'in' nằm trong list
            description: 'Toán tử: equals, contains, gte, lte, in (nằm trong danh sách)'
        },
        value: {
            type: SchemaType.STRING,
            description:  `Giá trị để lọc (luôn trả về dưới dạng chuỗi). QUY TẮC BẮT BUỘC:
            - Nếu field là "item_type": CHỈ ĐƯỢC dùng chính xác 1 trong các giá trị viết hoa: "FOOD", "DRINK", "ALCOHOL", "DESSERT", "SIDE_DISH", "TOPPING", "COMBO", "SERVICE", "OTHER". TUYỆT ĐỐI KHÔNG dịch sang tiếng Việt.
            - Nếu field là Số (base_price, discount_percent, totalRating): Trả về con số dạng chuỗi (VD: "50000", "4.5").
            - Nếu field là Ngày tháng (createdAt, discount_until): Trả về định dạng chuẩn ISO 8601.
            - Nếu field là Boolean (is_available, is_featured): Trả về chuỗi "true" hoặc "false".
            - Nếu operator là "in": Nối các giá trị bằng dấu phẩy, không có khoảng trắng (VD: "FOOD,DRINK" hoặc "Hà Nội,Đà Nẵng").`
           
        }
    },
    required: ['field', 'operator', 'value']

}
export const tools_MenuItem = [
    {
        name: 'countMenuItem',
        description: 'Đếm số lượng món ăn (menu item) dựa trên điều kiện lọc AND và OR. Có thể lọc theo thông tin món, phân loại, hoặc lọc chéo theo tên thương hiệu, tên nhà hàng, danh mục.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                AND: {
                    type: SchemaType.ARRAY,
                    description: 'Danh sách các điều kiện bắt buộc phải thỏa mãn TẤT CẢ (giao nhau).',
                    items: filterItemSchema
                },
                OR: {
                    type: SchemaType.ARRAY,
                    description: 'Danh sách các điều kiện chỉ cần thỏa mãn MỘT TRONG SỐ ĐÓ (hợp nhau).',
                    items: filterItemSchema
                }
            }
        }
    },
    {
        name: 'getMenuItems',
        description: 'Lấy danh sách món ăn (menu item) dựa trên điều kiện lọc AND và OR. Có thể lọc theo thông tin món, phân loại, hoặc lọc chéo theo tên thương hiệu, tên nhà hàng, danh mục.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                AND: {
                    type: SchemaType.ARRAY,
                    description: 'Danh sách các điều kiện bắt buộc phải thỏa mãn TẤT CẢ (giao nhau).',
                    items: filterItemSchema
                },
                OR: {
                    type: SchemaType.ARRAY,
                    description: 'Danh sách các điều kiện chỉ cần thỏa mãn MỘT TRONG SỐ ĐÓ (hợp nhau).',
                    items: filterItemSchema
                }
            }
        }
    },
    {
        name: 'getMenuItem',
        description: 'Lấy thông tin chi tiết của một món ăn (menu item) đầu tiên thỏa mãn điều kiện lọc AND và OR. Có thể lọc theo thông tin món, phân loại, hoặc lọc chéo theo tên thương hiệu, tên nhà hàng, danh mục.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                AND: {
                    type: SchemaType.ARRAY,
                    description: 'Danh sách các điều kiện bắt buộc phải thỏa mãn TẤT CẢ (giao nhau).',
                    items: filterItemSchema
                },
                OR: {
                    type: SchemaType.ARRAY,
                    description: 'Danh sách các điều kiện chỉ cần thỏa mãn MỘT TRONG SỐ ĐÓ (hợp nhau).',
                    items: filterItemSchema
                }
            }
        }
    }
];

