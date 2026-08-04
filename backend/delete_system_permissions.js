import { prisma } from './src/databases/init.mongodb.js';

async function deleteSystemPermissions() {
    try {
        console.log("Đang xóa các quyền SYSTEM khỏi bảng Permission...");
        const result = await prisma.permission.deleteMany({
            where: {
                type: 'SYSTEM'
            }
        });
        console.log(`✅ Đã xóa thành công ${result.count} quyền (Permissions) hệ thống!`);
    } catch (error) {
        console.error("❌ Lỗi khi xóa Permissions:", error);
    } finally {
        await prisma.$disconnect();
    }
}

deleteSystemPermissions();
