import {prisma} from "../../../../databases/init.mongodb.js"
export const parseValue = (value) => {
    // 1. Kiểm tra Boolean
    if (value === 'true') return true;
    if (value === 'false') return false;

    // 2. Kiểm tra Number (Số)
    // Cần cẩn thận: không parse các chuỗi số 0 ở đầu (như số điện thoại '0901234567') thành số
    if (!isNaN(value) && value.trim() !== '' && !value.startsWith('0')) {
        return Number(value);
    }

    // 3. Kiểm tra Ngày tháng năm (Date) cho MongoDB
    // Regex bắt định dạng YYYY-MM-DD (VD: 2026-04-08) 
    // hoặc ISO 8601 đầy đủ (VD: 2026-04-08T08:44:50.000Z)
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?)?$/;
    
    if (dateRegex.test(value)) {
        const parsedDate = new Date(value);
        // Đảm bảo sau khi new Date(), giá trị thực sự hợp lệ (không phải Invalid Date)
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate; 
        }
    }

    // 4. Mặc định giữ nguyên là chuỗi (String)
    return value;
}
export const mapOperator = (field, operator, value) => {
  const parsedValue = parseValue(value);

  // 1. Khởi tạo giá trị điều kiện (condition) dựa trên operator
  let condition;
  switch (operator) {
    case 'equals':
      condition = parsedValue;
      break;
    case 'contains':
      // Thêm mode: 'insensitive' để tìm kiếm không phân biệt chữ hoa/thường (rất hữu ích cho name)
      condition = { contains: String(parsedValue), mode: 'insensitive' };
      break;
    case 'gte':
      condition = { gte: parsedValue };
      break;
    case 'lte':
      condition = { lte: parsedValue };
      break;
    case 'in':
      const arrayValues = String(value).split(',').map(v => parseValue(v.trim()));
      condition = { in: arrayValues };
      break;
    default:
      return {};
  }

  // 2. Xử lý trường hợp field là Nested object (vd: brand.name)
  if (field.includes('.')) {
    const keys = field.split('.'); // ['brand', 'name']
    
    // Tạo object lồng nhau từ phải qua trái. 
    // Vd: Từ condition = "KFC" -> { name: "KFC" } -> { brand: { name: "KFC" } }
    return keys.reduceRight((acc, key) => {
      return { [key]: acc };
    }, condition);
  }

  // 3. Xử lý trường hợp field bình thường (vd: city)
  if (field === 'city') {
    return { address: { is: { province: condition } } };
  }
  return { [field]: condition };
}
export const countBrand=async (where)=>{
      return await prisma.brand.count({ where});
}
export const countRestaurant=async (where)=>{
     return await prisma.restaurant.count({ where});
}
export const countMenuItem=async (where)=>{
     return await prisma.menuItem.count({ where});
}
//  vd
// where: {
//     category: {
//       name: "Món hè"
//     }
//   }
export const getRestaurants=async(where)=>{
    return await prisma.restaurant.findMany({where})
}
export const getRestaurant=async(where)=>{
    return await prisma.restaurant.findFirst({where})
}
export const getBrands=async(where)=>{
  return await prisma.brand.findMany({where});
}
export const getBrand=async(where)=>{
  return await prisma.brand.findFirst({where});
}
export const getMenuItems=async (where)=>{
  return await prisma.menuItem.findMany({where})
}
export const getMenuItem=async (where)=>{
  return await prisma.menuItem.findFirst({where})
}
