import { prisma } from './src/databases/init.mongodb.js';
import { permission_data } from './src/databases/seed/constants/permission.data.js';

async function updatePermissions() {
    try {
        console.log("Đang cập nhật danh sách Permissions mới vào Database...");
        let count = 0;
        for (const perm of permission_data) {
            await prisma.permission.upsert({
                where: { id: perm.id },
                update: {
                    name: perm.name,
                    description: perm.description,
                    type: perm.type
                },
                create: perm
            });
            count++;
        }
        console.log(`✅ Đã cập nhật thành công ${count} quyền (Permissions) vào Database!`);
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật Permissions:", error);
    } finally {
        await prisma.$disconnect();
    }
}

updatePermissions();
