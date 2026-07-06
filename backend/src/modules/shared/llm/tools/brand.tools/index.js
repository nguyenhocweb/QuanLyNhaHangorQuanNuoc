import { SchemaType } from "@google/generative-ai";

const filterItemSchema = {
  type: SchemaType.OBJECT,
  properties: {
    field: {
      type: SchemaType.STRING,
      enum: ['city', 'address', 'is_active', 'name', 'isNew', 'isFeatured', 'createdAt'],
description: `Trường dữ liệu cần lọc. Hướng dẫn chi tiết:
      - city (chuỗi): Tỉnh/Thành phố (VD: "Hà Nội", "Hồ Chí Minh").
      - address (chuỗi): Địa chỉ chi tiết.
      - name (chuỗi): Tên hiển thị (Tên nhà hàng/cơ sở).
      - is_active (enum): Trạng thái hoạt động của cơ sở.
      - isNew (boolean): Cờ đánh dấu cơ sở mới khai trương.
      - isFeatured (boolean): Đánh dấu cơ sở nổi bật/được đề xuất.
      - createdAt (ngày tháng): Ngày tạo/thêm cơ sở này vào hệ thống.`
    }, 
    operator: {
      type: SchemaType.STRING,
      enum: ['equals', 'contains', 'gte', 'lte', 'in'],
      // 'equals' = , 'contains' chứa, 'gte' >=, 'lte' <=, 'in' nằm trong list
      description: 'Toán tử: equals, contains, gte, lte, in (nằm trong danh sách)'
    },
    value: {
      type: SchemaType.STRING,
     description: `Giá trị để lọc (luôn trả về dưới dạng chuỗi). QUY TẮC BẮT BUỘC:
      - Nếu field là "is_active": BẮT BUỘC chỉ được trả về chính xác 1 trong 3 chuỗi viết hoa: "ACTIVE", "INACTIVE", "TERMINATED". Cấm dịch ra tiếng Việt.
      - Nếu field là Boolean (isNew, isFeatured): Trả về chuỗi "true" hoặc "false".
      - Nếu field là Ngày tháng (createdAt): Trả về định dạng chuẩn ISO 8601.
      - Nếu operator là "in": Truyền vào chuỗi cách nhau bằng dấu phẩy, không có khoảng trắng thừa (vd: "Đà Nẵng,Hà Nội" hoặc "ACTIVE,INACTIVE").`
    }
  },
  required: ['field', 'operator', 'value']
};

export const tools_Brand =
  [
    {
      name: 'countBrand',
      description: 'Đếm số lượng thương hiệu dựa trên điều kiện AND và OR.',
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
  name: 'getBrands',
  description: 'Lấy danh sách các thương hiệu và chi tiết thông tin các thương hiệu dựa trên điều kiện AND và OR.',
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
  name: 'getBrand',
  description: 'Lấy thông tin chi tiết của một thương hiệu đầu tiên thỏa mãn điều kiện AND và OR.',
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
  ]
  ;
