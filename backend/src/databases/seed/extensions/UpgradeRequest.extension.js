import { Upgrade_Request } from "../constants/UpgradeRequest.data.js";


export const upgradeRequest_Extension = async (prisma) => {
    console.log('🚀 Creating Upgrade Requests...');
    
    // Gọi hàm để lấy mảng data
    const requestData = await Upgrade_Request(); 
    
    const result = await prisma.upgradeRequest.createMany({
        data: requestData
    });
    
    console.log(`✅ Đã tạo thành công ${result.count} yêu cầu nâng cấp!`);
}
