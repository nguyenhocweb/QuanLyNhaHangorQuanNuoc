import { SystemRoleData, WorkspaceRoleData } from "../constants/user.data.js";
export const roleExtension = async (prisma) => {
    console.log('🚀 Creating Roles...');
  
    const result1 = await prisma.systemRole.createMany({
        data: SystemRoleData,
    });
    
    const result2 = await prisma.workspaceRole.createMany({
        data: WorkspaceRoleData,
    });
    console.log(`✅ Đã tạo thành công ${result1.count} SystemRoles và ${result2.count} WorkspaceRoles!`);
}
