import role from "../constants/role.data.js";
export const roleExtension = async (prisma) => {
    // 1. Xóa dữ liệu cũ (Tùy chọn - cẩn thận khi dùng)
    // console.log('🗑️ Cleaning old data...');
    // await db.role.deleteMany(); 
    // 2. TẠO NHIỀU (Bulk Create)
    // thương hiệu
    console.log('🚀 Creating Roles...');

  
    const result = await prisma.Role.createMany({
        data: role,       // Mảng dữ liệu
    });
    console.log(`✅ Đã tạo thành công ${ result.count} Roles!`);
    // ID sẽ tự động sinh dạng: ROLE_xxxx...
}