
import { SchemaType } from "@google/generative-ai";
const filterItemSchema = {
  type: SchemaType.OBJECT,
  properties: {
    field: {
      type: SchemaType.STRING,
      enum: ['city', 'description', 'address', 'isActive', 'name', 'isNew', 'slug', `totalRating`, 'createdAt', 'brand.name', 'categories.name'],

      // DẠY AI Ý NGHĨA TỪNG TRƯỜNG Ở ĐÂY
      description: `Trường dữ liệu cần lọc. Giải thích chi tiết:
      - city (chuỗi): Tỉnh/Thành phố (vd: "Hà Nội", "Đà Nẵng").
      - address (chuỗi): Địa chỉ chi tiết của quán/thương hiệu.
      - name (chuỗi): Tên hiển thị.
      - description (chuỗi): Bài viết mô tả giới thiệu.
      - isActive (enum): Trạng thái hoạt động.("ACTIVE":đang hoạt động,"INACTIVE":tạm thời nghĩ, "TERMINATED":nghĩ vĩnh viễn)
      - isNew (boolean): Cờ đánh dấu xem đây có phải là cơ sở mới mở không (true/false).
      - slug (chuỗi): Đường dẫn tĩnh trên URL.
      - totalRating (số): Tổng điểm đánh giá trung bình từ khách hàng (dùng khi user hỏi về quán ngon, đánh giá cao/thấp).
      - createdAt (ngày tháng): Thời gian tạo trên hệ thống.
      - brand.name (chuỗi): Tên của thương hiệu quản lý nhà hàng (Lọc chéo).
      - categories.name (chuỗi): Tên loại hình/danh mục của nhà hàng (vd: "Lẩu", "Nướng BBQ", "Món Chay", "Hải sản", "Nhật Bản", "Cafe"). Dùng khi user muốn tìm quán theo thể loại, món ăn hoặc phong cách.`
    },
    operator: {
      type: SchemaType.STRING,
      enum: ['equals', 'contains', 'gte', 'lte', 'in'],
      // 'equals' = , 'contains' chứa, 'gte' >=, 'lte' <=, 'in' nằm trong list
      description: 'Toán tử: equals, contains, gte, lte, in (nằm trong danh sách)'
    },
    value: {
      type: SchemaType.STRING,
      // DẠY AI CÁCH ÉP KIỂU TRƯỚC KHI TRẢ VỀ
      description: [
        'Giá trị để lọc. Với toán tử "in", truyền vào chuỗi cách nhau bằng dấu phẩy (vd: "Đà Nẵng,Hà Nội").',
        ` Nếu field là Ngày tháng (createdAt): Trả về định dạng chuẩn ISO 8601.`,
        'ĐẶC BIỆT: Nếu field là "isActive", BẮT BUỘC chỉ được trả về chính xác 1 trong 3 chuỗi viết hoa này: "ACTIVE", "INACTIVE", "TERMINATED". Cấm dịch ra tiếng Việt. Với toán tử "in", truyền các giá trị Enum cách nhau bằng dấu phẩy (vd: "ACTIVE,INACTIVE").',
        'MẸO: Nếu field là "categories.name", ưu tiên sử dụng toán tử "contains" để tìm kiếm linh hoạt hơn.'
      ].join(" ")
    }
  },
  required: ['field', 'operator', 'value']
};
export const tools_Restaurant = [
  {
    name: 'countRestaurant',
    description: 'Đếm số lượng nhà hàng dựa trên điều kiện AND và OR.Có thể lọc theo thông tin nhà hàng, lọc theo tên thương hiệu hoặc id thương hiệu',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        AND: {
          type: SchemaType.ARRAY,
          description: 'Danh sách các điều kiện bắt buộc phải thỏa mãn tất cả.',
          items: filterItemSchema
        },
        OR: {
          type: SchemaType.ARRAY,
          description: 'Danh sách các điều kiện chỉ cần thỏa mãn 1 trong số đó.',
          items: filterItemSchema
        }
      }
    }
  },
  {
    name: 'getRestaurants',
    description: 'Lấy danh sách các nhà hàng dựa trên điều kiện AND và OR.Có thể lọc theo thông tin nhà hàng, lọc theo tên thương hiệu hoặc id thương hiệu',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        AND: {
          type: SchemaType.ARRAY,
          description: 'Danh sách các điều kiện bắt buộc phải thỏa mãn tất cả.',
          items: filterItemSchema
        },
        OR: {
          type: SchemaType.ARRAY,
          description: 'Danh sách các điều kiện chỉ cần thỏa mãn 1 trong số đó.',
          items: filterItemSchema
        }
      }
    }
  },
  {
    name: 'getRestaurant',
    description: 'Lấy thông tin chi tiết của một nhà hàng đầu tiên thỏa mãn điều kiện AND và OR.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        AND: {
          type: SchemaType.ARRAY,
          description: 'Danh sách các điều kiện bắt buộc phải thỏa mãn tất cả.',
          items: filterItemSchema
        },
        OR: {
          type: SchemaType.ARRAY,
          description: 'Danh sách các điều kiện chỉ cần thỏa mãn 1 trong số đó.',
          items: filterItemSchema
        }
      }
    }
  }
];
